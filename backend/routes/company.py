from fastapi import APIRouter, Depends, HTTPException
from backend.crud.employee import get_employees, get_attendance_list
from backend.models.employee import EmployeeResponse
from backend.models.detect import EndDetectRequest
from backend.utils.dependencies import company_required
from datetime import date
from backend.db import db
from datetime import datetime, timedelta, date, time
from typing import List, Dict, Any

company_router = APIRouter(tags=["Company"])
attendance_col = db["attendance"]
employee_col = db["employee"]
ppe_col = db["ppe_records"]


@company_router.get("/emp_list", response_model=list[EmployeeResponse])
async def get_all_emp(current_user: dict = Depends(company_required)):
    employees = await get_employees(current_user["id"])
    print("HII")
    print(current_user["id"])
    return [EmployeeResponse.from_mongo(employee) for employee in employees]


@company_router.post("/end_detect", response_model=dict)
async def end_detectioin(payload: EndDetectRequest, current_user: dict = Depends(company_required)):
    if not payload.end:
        return {"status": "Detection not ended yet"}

    print(payload.end)
    today = date.today().isoformat()
    company_id = current_user["id"]

    # all
    employees = await get_employees(company_id)
    # today
    todays_attendance = await get_attendance_list(company_id)
    if not todays_attendance:
        return {"status": "No attendance records yet for today."}

    present_records = [a for a in todays_attendance if a.get("present") is True]
    absent_records = [a for a in todays_attendance if a.get("present") is False]

    attended_emails = {a["employee_email"] for a in todays_attendance}

    missing_employees = [
        emp for emp in employees if emp["email"] not in attended_emails
    ]

    # Find missing employees
    if missing_employees:
        absent_docs = [
            {
                "employee_email": emp["email"],
                "company_id": company_id,
                "attendance_date": today,
                "present": False
            }
            for emp in missing_employees
        ]

        try:
            await attendance_col.insert_many(absent_docs)
            absent_records.extend(absent_docs)  # add them to count
        except Exception as e:
            print(f"Error inserting absent records: {e}")
            raise HTTPException(status_code=500, detail="Failed to mark absences")

    present_count = len(present_records)
    absent_count = len(absent_records)
    total_employees = len(employees)

    return {
        "status": "Attendance finalized for today",
        "present_count": present_count,
        "absent_count": absent_count,
        "total_employees": total_employees,
        "first_finalize": bool(missing_employees)
    }


@company_router.get("/dashboard", response_model=dict)
async def view_dashboard(current_user: dict = Depends(company_required)):
    today = date.today().isoformat()
    company_id = current_user["id"]

    # Total employees
    employees = await get_employees(company_id)
    total_employees = len(employees)
    if total_employees == 0:
        return {"status": "No employees found for this company"}

    # Attendance rate for today
    attendance_today = await attendance_col.find({
        "company_id": company_id,
        "attendance_date": today
    }).to_list()

    present_count = sum(1 for a in attendance_today if a.get("present") is True)
    absent_count = sum(1 for a in attendance_today if a.get("present") is False)

    # Check for division by zero
    average_attendance_rate = round((present_count / total_employees) * 100, 2) if total_employees > 0 else 0

    # PPE results for today
    today_date = datetime.utcnow().date()
    tomorrow_date = today_date + timedelta(days=1)

    ppe_results = await ppe_col.find({
        "company_id": company_id,
        "timestamp": {
            "$gte": datetime.combine(today_date, datetime.min.time()),
            "$lt": datetime.combine(tomorrow_date, datetime.min.time())
        }
    }).to_list()

    # Compute compliance statuses of all for today
    fully, partially, non = 0, 0, 0
    violation_counts = {"helmet": 0, "vest": 0, "gloves": 0, "goggles": 0, "ear protection": 0}

    total_checked = len(ppe_results)
    print(f"Total PPE records checked: {total_checked}")

    # Handle case when no PPE records exist
    if total_checked > 0:
        for record in ppe_results:
            ppe = record.get("ppe_result", {})
            if not ppe:
                continue

            detected_count = sum(1 for item, val in ppe.items() if item != "person" and val)
            missed_count = 5 - detected_count

            # Update violations per item
            for item, val in ppe.items():
                if item in violation_counts and not val:
                    violation_counts[item] += 1

            # Compliance classification
            if missed_count == 0:
                fully += 1
            elif 1 <= missed_count <= 2:
                partially += 1
            else:
                non += 1

        # Calculate safety rate only when we have data
        average_safety_rate = round(((fully + partially * 0.6) / total_checked) * 100, 2)
    else:
        # No PPE records today, set default values
        average_safety_rate = 0
        fully = partially = non = 0

    print(f"Average safety rate: {average_safety_rate}")

    # attendance with employee info
    attendance_dict = []
    emp_map = {e["email"]: e for e in employees}

    for a in attendance_today:
        emp = emp_map.get(a["employee_email"])
        if emp:
            attendance_dict.append({
                "employee_id": emp["employee_id"],
                "name": emp["name"],
                "image_path": emp["image_path"],
                "marked_at": a["attendance_date"],
                "present": a["present"]
            })

    # employees with most violations (non-compliant)
    non_compliant_records = [
        rec for rec in ppe_results if rec.get("compliance_status") == "non"
    ]
    employee_violations = {}
    for rec in non_compliant_records:
        email = rec.get("employee_email")
        if not email:
            continue

        ppe = rec.get("ppe_result", {})
        missed = sum(1 for item, val in ppe.items() if item != "person" and not val)

        if email not in employee_violations:
            employee_violations[email] = 0
        employee_violations[email] += missed

    top_non_compliant = []
    emp_map = {e["email"]: e for e in employees}

    for email, violation_count in sorted(employee_violations.items(), key=lambda x: x[1], reverse=True)[:5]:
        emp = emp_map.get(email)
        if not emp:
            continue

        # Handle division by zero
        ppe_violation_percent = round((violation_count / 5) * 100, 2) if violation_count > 0 else 0
        top_non_compliant.append({
            "employee_id": emp["employee_id"],
            "name": emp["name"],
            "image_path": emp["image_path"],
            "total_violations": violation_count,
            "ppe_violation_percent": ppe_violation_percent
        })

    # compliance distribution for Pie Chart
    # Handle division by zero
    compliance_distribution = {
        "fully": {"count": fully, "percent": round((fully / total_employees) * 100, 2) if total_employees > 0 else 0},
        "partially": {"count": partially,
                      "percent": round((partially / total_employees) * 100, 2) if total_employees > 0 else 0},
        "non": {"count": non, "percent": round((non / total_employees) * 100, 2) if total_employees > 0 else 0}
    }

    # PPE Violations for Bar Chart
    violations_today = [
        {"item": k, "count": v}
        for k, v in violation_counts.items()
    ]

    return {
        "date": today,
        "company_id": company_id,
        "total_employees": total_employees,
        "present_count": present_count,
        "absent_count": absent_count,
        "average_attendance_rate": average_attendance_rate,
        "average_safety_rate": average_safety_rate,
        "attendance_today": attendance_dict,
        "most_non_compliant_employees": top_non_compliant,
        "compliance_distribution": compliance_distribution,
        "ppe_violations_today": violations_today,
    }


def date_range(start: date, days: int) -> List[date]:
    return [start - timedelta(days=(days - 1 - i)) for i in range(days)]


# Convert employee doc to simple map by email
def build_emp_map(employees: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    return {e.get("email"): e for e in employees}


@company_router.get("/weekly_dashboard", response_model=dict)
async def weekly_dashboard(current_user: dict = Depends(company_required)):
    company_id = current_user["id"]
    today = date.today()

    this_week_end = today
    this_week_start = today - timedelta(days=6)
    this_week_dates = [this_week_start + timedelta(days=i) for i in range(7)]

    last_week_end = this_week_start - timedelta(days=1)
    last_week_start = last_week_end - timedelta(days=6)
    last_week_dates = [last_week_start + timedelta(days=i) for i in range(7)]

    employees = await get_employees(company_id)
    total_employees = len(employees)
    emp_map = build_emp_map(employees)

    daily_attendance_this = []  # list of {date, present_count, absent_count, rate}
    daily_attendance_last = []
    daily_safety_this = []  # safety rate per day (based on PPE checked that day)
    daily_safety_last = []

    week_fully = week_partial = week_non = 0
    week_ppe_checked = 0
    week_violation_counts = {"helmet": 0, "vest": 0, "gloves": 0, "goggles": 0, "ear protection": 0}
    employee_week_violations: Dict[str, int] = {}
    employee_attendance_days: Dict[str, int] = {}
    unique_absent_employees_set = set()

    async def get_ppe_for_date(d: date) -> List[Dict[str, Any]]:

        start_dt = datetime.combine(d, time.min)
        end_dt = start_dt + timedelta(days=1)
        cursor = ppe_col.find({
            "company_id": company_id,
            "timestamp": {"$gte": start_dt, "$lt": end_dt}
        })
        return await cursor.to_list(length=None)

    async def get_attendance_for_date(d: date) -> List[Dict[str, Any]]:
        date_str = d.isoformat()
        cursor = attendance_col.find({
            "company_id": company_id,
            "attendance_date": date_str
        })
        return await cursor.to_list(length=None)

    for d in this_week_dates:

        attendance_docs = await get_attendance_for_date(d)
        present_count = sum(1 for a in attendance_docs if a.get("present") is True)
        absent_count = sum(1 for a in attendance_docs if a.get("present") is False)

        for a in attendance_docs:
            emp_email = a.get("employee_email")
            if emp_email and not a.get("present"):
                unique_absent_employees_set.add(emp_email)

        for a in attendance_docs:
            emp_email = a.get("employee_email")
            emp_id = None
            if emp_email and emp_map.get(emp_email):
                emp_id = emp_map[emp_email].get("employee_id")

            key = emp_id or emp_email
            if key:
                if a.get("present"):
                    employee_attendance_days[key] = employee_attendance_days.get(key, 0) + 1
                else:

                    employee_attendance_days.setdefault(key, employee_attendance_days.get(key, 0))

        rate = round((present_count / total_employees) * 100, 2) if total_employees > 0 else 0.0
        daily_attendance_this.append({
            "date": d.isoformat(),
            "present_count": present_count,
            "absent_count": absent_count,
            "attendance_rate": rate
        })

        # PPE / safety calculations for day
        ppe_docs = await get_ppe_for_date(d)
        fully = partially = non = 0
        checked_count = 0
        for rec in ppe_docs:
            ppe = rec.get("ppe_result", {}) or {}
            if not ppe:
                continue
            checked_count += 1
            detected_count = sum(1 for item, val in ppe.items() if item != "person" and val)
            missed_count = 5 - detected_count

            for item, val in ppe.items():
                if item in week_violation_counts and not val:
                    week_violation_counts[item] += 1

            if missed_count == 0:
                fully += 1
            elif 1 <= missed_count <= 2:
                partially += 1
            else:
                non += 1

            email = rec.get("employee_email")
            if email:
                employee_week_violations[email] = employee_week_violations.get(email, 0) + missed_count

        if checked_count == 0:
            day_safety_rate = None
        else:
            day_safety_rate = round(((fully + partially * 0.6) / checked_count) * 100, 2)
        daily_safety_this.append({
            "date": d.isoformat(),
            "safety_rate": day_safety_rate,
            "checked_count": checked_count
        })

        week_fully += fully
        week_partial += partially
        week_non += non
        week_ppe_checked += checked_count

    for d in last_week_dates:
        attendance_docs = await get_attendance_for_date(d)
        present_count = sum(1 for a in attendance_docs if a.get("present") is True)
        absent_count = sum(1 for a in attendance_docs if a.get("present") is False)
        rate = round((present_count / total_employees) * 100, 2) if total_employees > 0 else 0.0
        daily_attendance_last.append({
            "date": d.isoformat(),
            "present_count": present_count,
            "absent_count": absent_count,
            "attendance_rate": rate
        })

        ppe_docs = await get_ppe_for_date(d)
        fully = partially = non = 0
        checked_count = 0
        for rec in ppe_docs:
            ppe = rec.get("ppe_result", {}) or {}
            if not ppe:
                continue
            checked_count += 1
            detected_count = sum(1 for item, val in ppe.items() if item != "person" and val)
            missed_count = 5 - detected_count
            if missed_count == 0:
                fully += 1
            elif 1 <= missed_count <= 2:
                partially += 1
            else:
                non += 1
        if checked_count == 0:
            day_safety_rate = None
        else:
            day_safety_rate = round(((fully + partially * 0.6) / checked_count) * 100, 2)
        daily_safety_last.append({
            "date": d.isoformat(),
            "safety_rate": day_safety_rate,
            "checked_count": checked_count
        })

    attendance_rates_available = [
        d["attendance_rate"]
        for d in daily_attendance_this
        if d.get("present_count", 0) + d.get("absent_count", 0) > 0
    ]

    if attendance_rates_available:
        avg_attendance_week = round(sum(attendance_rates_available) / len(attendance_rates_available), 2)
    else:
        avg_attendance_week = 0.0

    if week_ppe_checked == 0:
        average_safety_rate_week = 0.0
    else:
        average_safety_rate_week = round(((week_fully + week_partial * 0.6) / week_ppe_checked) * 100, 2)

    # absent employees of this week (unique emails)
    absent_employees_count = len(unique_absent_employees_set)

    # pie chart distribution for this week
    if week_ppe_checked == 0:
        fully_percent = partial_percent = non_percent = total_compliance_percent = 0
    else:
        fully_percent = round((week_fully / week_ppe_checked) * 100, 2)
        partial_percent = round((week_partial / week_ppe_checked) * 100, 2)
        non_percent = round((week_non / week_ppe_checked) * 100, 2)
        total_compliance_percent = round(((week_fully + week_partial) / week_ppe_checked) * 100, 2)

    # pie chart data
    pie_data = [
        {"name": "Fully", "percent": fully_percent},
        {"name": "Partially", "percent": partial_percent},
        {"name": "Non", "percent": non_percent},
    ]

    # 6. Top 6 employees needing improvement
    top6 = []

    sorted_violations = sorted(employee_week_violations.items(), key=lambda x: x[1], reverse=True)[:6]
    for email, miss_count in sorted_violations:
        emp = emp_map.get(email, {})
        emp_id = emp.get("employee_id") or ""
        name = emp.get("name") or email

        start_dt = datetime.combine(this_week_start, time.min)
        end_dt = datetime.combine(this_week_end + timedelta(days=1), time.min)
        emp_ppe_docs = await ppe_col.find({
            "company_id": company_id,
            "employee_email": email,
            "timestamp": {"$gte": start_dt, "$lt": end_dt}
        }).to_list(length=None)
        times_checked = len(emp_ppe_docs)

        max_items = max(1, times_checked * 5)
        worn_percent = round(((max_items - miss_count) / max_items) * 100, 2) if times_checked > 0 else 0.0
        top6.append({
            "employee_email": email,
            "employee_id": emp_id,
            "name": name,
            "violation_count": miss_count,
            "overall_worn_percent": worn_percent
        })

    per_employee_attendance = []

    for emp in employees:
        emp_id = emp.get("employee_id")
        email = emp.get("email")
        key = emp_id or email
        days_present = employee_attendance_days.get(key, 0)

        attendance_rate = round((days_present / 7) * 100, 2)
        per_employee_attendance.append({
            "employee_id": emp_id,
            "name": emp.get("name"),
            "days_present": days_present,
            "attendance_rate": attendance_rate
        })
    # sort descending by rate (or name)
    per_employee_attendance.sort(key=lambda x: x["attendance_rate"], reverse=True)

    # PPE class violations this week (bar chart)
    ppe_class_violations = [{"item": k, "count": v} for k, v in week_violation_counts.items()]

    # This week vs Last week attendance arrays (for chart)
    comparison_attendance = []
    print("Daily Attendance", daily_attendance_this)
    for i in range(7):
        d_this = daily_attendance_this[i]
        d_last = daily_attendance_last[i]
        comparison_attendance.append({
            "date": d_this["date"],
            "this_week_attendance": d_this["attendance_rate"],
            "last_week_attendance": d_last["attendance_rate"]
        })

    def map_dates_to_rate(daily_safety_list):
        return {d["date"]: d["safety_rate"] for d in daily_safety_list}

    safety_map_this = map_dates_to_rate(daily_safety_this)
    safety_map_last = map_dates_to_rate(daily_safety_last)

    safety_comparison = []

    # loop through 7 days (this week)
    print("Safety", safety_map_this)
    print("Daily Safety", daily_safety_this)
    for d in this_week_dates:
        ds = d.isoformat()
        safety_comparison.append({
            "date": ds,
            "this_week_safety": safety_map_this.get(ds, 0) or 0,
            "last_week_safety": safety_map_last.get((d - timedelta(days=7)).isoformat(), 0) or 0
        })
    print("COmparison")
    print(safety_comparison)
    print(comparison_attendance)
    result = {
        "this_week": {
            "start_date": this_week_start.isoformat(),
            "end_date": this_week_end.isoformat(),
            "daily_attendance": daily_attendance_this,
            "daily_safety": daily_safety_this,
        },
        "last_week": {
            "start_date": last_week_start.isoformat(),
            "end_date": last_week_end.isoformat(),
            "daily_attendance": daily_attendance_last,
            "daily_safety": daily_safety_last,
        },
        "summary": {
            "total_employees": total_employees,
            "average_attendance_rate_week": avg_attendance_week,
            "average_safety_rate_week": average_safety_rate_week,
            "unique_absent_employees_count": absent_employees_count,
            "ppe_checked_count_week": week_ppe_checked,
        },
        "pie_compliance_week": {
            "distribution": pie_data,
            "total_compliance_percent": total_compliance_percent,
            "week_fully": week_fully,
            "week_partial": week_partial,
            "week_non": week_non
        },
        "top_needing_improvement": top6,
        "per_employee_attendance": per_employee_attendance,
        "ppe_class_violations": ppe_class_violations,
        "attendance_comparison": comparison_attendance,
        "safety_comparison": safety_comparison
    }

    return result


@company_router.get("/monthly_dashboard", response_model=dict)
async def monthly_dashboard(current_user: dict = Depends(company_required)):
    company_id = current_user["id"]
    today = date.today()

    # Calculate this month's date range
    this_month_start = today.replace(day=1)
    if today.month == 12:
        this_month_end = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        this_month_end = today.replace(month=today.month + 1, day=1) - timedelta(days=1)

    this_month_dates = []
    current_date = this_month_start
    while current_date <= this_month_end:
        this_month_dates.append(current_date)
        current_date += timedelta(days=1)

    # Calculate last month's date range
    if this_month_start.month == 1:
        last_month_start = this_month_start.replace(year=this_month_start.year - 1, month=12)
    else:
        last_month_start = this_month_start.replace(month=this_month_start.month - 1, day=1)

    last_month_end = this_month_start - timedelta(days=1)

    last_month_dates = []
    current_date = last_month_start
    while current_date <= last_month_end:
        last_month_dates.append(current_date)
        current_date += timedelta(days=1)

    employees = await get_employees(company_id)
    total_employees = len(employees)
    emp_map = build_emp_map(employees)

    # Weekly breakdown for this month (4-5 weeks)
    weekly_attendance_this = []  # list of {week_number, attendance_rate, present_count, absent_count}
    weekly_attendance_last = []
    weekly_safety_this = []  # weekly safety rates
    weekly_safety_last = []

    month_fully = month_partial = month_non = 0
    month_ppe_checked = 0
    month_violation_counts = {"helmet": 0, "vest": 0, "gloves": 0, "goggles": 0, "ear protection": 0}
    employee_month_violations: Dict[str, int] = {}
    employee_attendance_days_month: Dict[str, int] = {}
    unique_absent_employees_set_month = set()

    async def get_ppe_for_date(d: date) -> List[Dict[str, Any]]:
        start_dt = datetime.combine(d, time.min)
        end_dt = start_dt + timedelta(days=1)
        cursor = ppe_col.find({
            "company_id": company_id,
            "timestamp": {"$gte": start_dt, "$lt": end_dt}
        })
        return await cursor.to_list(length=None)

    async def get_attendance_for_date(d: date) -> List[Dict[str, Any]]:
        date_str = d.isoformat()
        cursor = attendance_col.find({
            "company_id": company_id,
            "attendance_date": date_str
        })
        return await cursor.to_list(length=None)

    # Process this month data
    current_week_start = this_month_start
    week_number = 1

    while current_week_start <= this_month_end:
        week_end = min(current_week_start + timedelta(days=6), this_month_end)
        week_dates = [current_week_start + timedelta(days=i) for i in range((week_end - current_week_start).days + 1)]

        week_present_total = 0
        week_absent_total = 0
        week_days_with_data = 0

        week_fully = week_partial = week_non = 0
        week_ppe_checked = 0

        for d in week_dates:
            # Attendance data
            attendance_docs = await get_attendance_for_date(d)
            present_count = sum(1 for a in attendance_docs if a.get("present") is True)
            absent_count = sum(1 for a in attendance_docs if a.get("present") is False)

            for a in attendance_docs:
                emp_email = a.get("employee_email")
                if emp_email and not a.get("present"):
                    unique_absent_employees_set_month.add(emp_email)

            for a in attendance_docs:
                emp_email = a.get("employee_email")
                emp_id = None
                if emp_email and emp_map.get(emp_email):
                    emp_id = emp_map[emp_email].get("employee_id")

                key = emp_id or emp_email
                if key:
                    if a.get("present"):
                        employee_attendance_days_month[key] = employee_attendance_days_month.get(key, 0) + 1
                    else:
                        employee_attendance_days_month.setdefault(key, employee_attendance_days_month.get(key, 0))

            if present_count + absent_count > 0:
                week_present_total += present_count
                week_absent_total += absent_count
                week_days_with_data += 1

            # PPE data
            ppe_docs = await get_ppe_for_date(d)
            for rec in ppe_docs:
                ppe = rec.get("ppe_result", {}) or {}
                if not ppe:
                    continue
                week_ppe_checked += 1
                detected_count = sum(1 for item, val in ppe.items() if item != "person" and val)
                missed_count = 5 - detected_count

                for item, val in ppe.items():
                    if item in month_violation_counts and not val:
                        month_violation_counts[item] += 1

                if missed_count == 0:
                    week_fully += 1
                elif 1 <= missed_count <= 2:
                    week_partial += 1
                else:
                    week_non += 1

                email = rec.get("employee_email")
                if email:
                    employee_month_violations[email] = employee_month_violations.get(email, 0) + missed_count

        # Calculate weekly attendance rate
        if week_days_with_data > 0 and total_employees > 0:
            avg_daily_present = week_present_total / week_days_with_data
            weekly_attendance_rate = round((avg_daily_present / total_employees) * 100, 2)
        else:
            weekly_attendance_rate = 0.0

        weekly_attendance_this.append({
            "week_number": week_number,
            "attendance_rate": weekly_attendance_rate,
            "present_count": week_present_total,
            "absent_count": week_absent_total,
            "start_date": current_week_start.isoformat(),
            "end_date": week_end.isoformat()
        })

        # Calculate weekly safety rate
        if week_ppe_checked > 0:
            weekly_safety_rate = round(((week_fully + week_partial * 0.6) / week_ppe_checked) * 100, 2)
        else:
            weekly_safety_rate = 0.0

        weekly_safety_this.append({
            "week_number": week_number,
            "safety_rate": weekly_safety_rate,
            "checked_count": week_ppe_checked
        })

        month_fully += week_fully
        month_partial += week_partial
        month_non += week_non
        month_ppe_checked += week_ppe_checked

        current_week_start = week_end + timedelta(days=1)
        week_number += 1

    # Process last month data (simplified - just weekly attendance for comparison)
    current_week_start = last_month_start
    week_number = 1

    while current_week_start <= last_month_end:
        week_end = min(current_week_start + timedelta(days=6), last_month_end)
        week_dates = [current_week_start + timedelta(days=i) for i in range((week_end - current_week_start).days + 1)]

        week_present_total = 0
        week_absent_total = 0
        week_days_with_data = 0

        for d in week_dates:
            attendance_docs = await get_attendance_for_date(d)
            present_count = sum(1 for a in attendance_docs if a.get("present") is True)
            absent_count = sum(1 for a in attendance_docs if a.get("present") is False)

            if present_count + absent_count > 0:
                week_present_total += present_count
                week_absent_total += absent_count
                week_days_with_data += 1

        # Calculate weekly attendance rate for last month
        if week_days_with_data > 0 and total_employees > 0:
            avg_daily_present = week_present_total / week_days_with_data
            weekly_attendance_rate = round((avg_daily_present / total_employees) * 100, 2)
        else:
            weekly_attendance_rate = 0.0

        weekly_attendance_last.append({
            "week_number": week_number,
            "attendance_rate": weekly_attendance_rate,
            "present_count": week_present_total,
            "absent_count": week_absent_total,
            "start_date": current_week_start.isoformat(),
            "end_date": week_end.isoformat()
        })

        current_week_start = week_end + timedelta(days=1)
        week_number += 1

    # Calculate monthly averages
    attendance_rates_available = [
        week["attendance_rate"]
        for week in weekly_attendance_this
        if week["attendance_rate"] > 0
    ]

    if attendance_rates_available:
        avg_attendance_month = round(sum(attendance_rates_available) / len(attendance_rates_available), 2)
    else:
        avg_attendance_month = 0.0

    if month_ppe_checked == 0:
        average_safety_rate_month = 0.0
    else:
        average_safety_rate_month = round(((month_fully + month_partial * 0.6) / month_ppe_checked) * 100, 2)

    # Unique absent employees this month
    absent_employees_count_month = len(unique_absent_employees_set_month)

    # Monthly compliance distribution
    if month_ppe_checked == 0:
        fully_percent = partial_percent = non_percent = total_compliance_percent = 0
    else:
        fully_percent = round((month_fully / month_ppe_checked) * 100, 2)
        partial_percent = round((month_partial / month_ppe_checked) * 100, 2)
        non_percent = round((month_non / month_ppe_checked) * 100, 2)
        total_compliance_percent = round(((month_fully + month_partial) / month_ppe_checked) * 100, 2)

    # Monthly pie chart data
    pie_data_month = [
        {"name": "Fully", "percent": fully_percent},
        {"name": "Partially", "percent": partial_percent},
        {"name": "Non", "percent": non_percent},
    ]

    # Top employees needing improvement for the month
    top_month = []
    sorted_month_violations = sorted(employee_month_violations.items(), key=lambda x: x[1], reverse=True)[:6]

    for email, miss_count in sorted_month_violations:
        emp = emp_map.get(email, {})
        emp_id = emp.get("employee_id") or ""
        name = emp.get("name") or email

        start_dt = datetime.combine(this_month_start, time.min)
        end_dt = datetime.combine(this_month_end + timedelta(days=1), time.min)
        emp_ppe_docs = await ppe_col.find({
            "company_id": company_id,
            "employee_email": email,
            "timestamp": {"$gte": start_dt, "$lt": end_dt}
        }).to_list(length=None)
        times_checked = len(emp_ppe_docs)

        max_items = max(1, times_checked * 5)
        worn_percent = round(((max_items - miss_count) / max_items) * 100, 2) if times_checked > 0 else 0.0

        top_month.append({
            "employee_email": email,
            "employee_id": emp_id,
            "name": name,
            "violation_count": miss_count,
            "overall_worn_percent": worn_percent
        })

    # Monthly employee attendance
    per_employee_attendance_month = []
    days_in_month = (this_month_end - this_month_start).days + 1

    for emp in employees:
        emp_id = emp.get("employee_id")
        email = emp.get("email")
        key = emp_id or email
        days_present = employee_attendance_days_month.get(key, 0)

        attendance_rate = round((days_present / days_in_month) * 100, 2)
        per_employee_attendance_month.append({
            "employee_id": emp_id,
            "name": emp.get("name"),
            "days_present": days_present,
            "attendance_rate": attendance_rate,
            "total_days": days_in_month
        })

    per_employee_attendance_month.sort(key=lambda x: x["attendance_rate"], reverse=True)

    # Monthly PPE violations
    ppe_class_violations_month = [{"item": k, "count": v} for k, v in month_violation_counts.items()]

    # Monthly comparison data (this month vs last month by week)
    attendance_comparison_month = []

    # Align weeks for comparison (use minimum number of weeks between both months)
    min_weeks = min(len(weekly_attendance_this), len(weekly_attendance_last))

    for i in range(min_weeks):
        week_this = weekly_attendance_this[i]
        week_last = weekly_attendance_last[i] if i < len(weekly_attendance_last) else {"attendance_rate": 0}

        attendance_comparison_month.append({
            "week_number": i + 1,
            "this_month_attendance": week_this["attendance_rate"],
            "last_month_attendance": week_last["attendance_rate"]
        })

    # Safety comparison (this month vs last month - simplified)
    safety_comparison_month = []
    for i in range(min_weeks):
        week_this = weekly_safety_this[i] if i < len(weekly_safety_this) else {"safety_rate": 0}

        safety_comparison_month.append({
            "week_number": i + 1,
            "this_month_safety": week_this["safety_rate"],
            "last_month_safety": 0  # Could be enhanced to fetch last month's safety data
        })

    result = {
        "this_month": {
            "start_date": this_month_start.isoformat(),
            "end_date": this_month_end.isoformat(),
            "weekly_attendance": weekly_attendance_this,
            "weekly_safety": weekly_safety_this,
        },
        "last_month": {
            "start_date": last_month_start.isoformat(),
            "end_date": last_month_end.isoformat(),
            "weekly_attendance": weekly_attendance_last,
        },
        "summary": {
            "total_employees": total_employees,
            "average_attendance_rate_month": avg_attendance_month,
            "average_safety_rate_month": average_safety_rate_month,
            "unique_absent_employees_count": absent_employees_count_month,
            "ppe_checked_count_month": month_ppe_checked,
        },
        "pie_compliance_month": {
            "distribution": pie_data_month,
            "total_compliance_percent": total_compliance_percent,
            "month_fully": month_fully,
            "month_partial": month_partial,
            "month_non": month_non
        },
        "top_needing_improvement": top_month,
        "per_employee_attendance": per_employee_attendance_month,
        "ppe_class_violations": ppe_class_violations_month,
        "attendance_comparison": attendance_comparison_month,
        "safety_comparison": safety_comparison_month
    }

    return result