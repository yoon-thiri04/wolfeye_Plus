from backend.db import db
from backend.models.detect import PPERecordCreate, PPEResult
from datetime import datetime

ppe_collection = db["ppe_records"]
employee_col = db["employee"]


async def save_ppe_record(employee_email: str, company_id: str, ppe_status: dict, points_today: int,
                          compliance_status: str):
    record = {
        "employee_email": employee_email,
        "company_id": company_id,
        "ppe_result": ppe_status,
        "timestamp": datetime.now(),
        "today_points": points_today,
        "compliance_status": compliance_status
    }
    print(record)
    try:
        await ppe_collection.insert_one(record)
        employee = await employee_col.find_one({"email": employee_email})
        if employee:
            current_total = employee["point_total"]
            new_total = current_total + points_today

            await employee_col.update_one(
                {"_id": employee["_id"]},
                {"$set": {"point_total": new_total}}
            )
            print(f"[DB] Updated total points for {employee_email}: {new_total}")
        else:
            print(f"[WARN] No employee found for email: {employee_email}")

        return True

    except:
        print("Error Saving")
        return False
