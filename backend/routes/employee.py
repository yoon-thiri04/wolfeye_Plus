from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException,status
from fastapi.responses import JSONResponse
from backend.crud.company import get_info
from backend.models.company import CompanyResponse
from backend.crud.employee import save_employee,get_employees,get_attendance,get_employee
from backend.crud.helper import format_embedding_result,cosine_similarity
import numpy as np
from backend.crud.auth import get_user_by_email
from backend.utils.dependencies import company_required, employee_required
from backend.models.employee import EmployeeCreate, EmployeeResponse
from backend.db import db
import shutil
import os
from deepface import DeepFace
from bson import ObjectId
from PIL import Image
from datetime import datetime,date, timedelta
from collections import defaultdict
from pydantic import BaseModel
from fastapi.responses import JSONResponse

# Directories
UPLOAD_DIR = "employee_profiles/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

FRAME_DIR = "temp_uploads"
os.makedirs(FRAME_DIR, exist_ok=True)

class UserLogin(BaseModel):
    email: str
    password: str

# Router
employee_router = APIRouter()
EMP_TEMP_PASSWORD = "employee@123!"
ppe_col = db["ppe_records"]
company_col = db["company"]
attendance_col = db["attendance"]

# ----------------------------
# Create employee endpoint
# ----------------------------
@employee_router.post("/", response_model=dict)
async def create_employee_api(
        emp_id: str = Form(...),
        name: str = Form(...),
        email: str = Form(None),
        image: UploadFile = File(...),
        current_user: dict = Depends(company_required)
):
    # Save image to disk
    file_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    print(file_path)
    raw_result = DeepFace.represent(img_path=file_path)[0]
    print(raw_result)
    embedding_data = format_embedding_result(raw_result)

    existing_user = await get_user_by_email(email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this mail already exists!")

    # Create employee object
    employee = EmployeeCreate(
        employee_id=emp_id,
        name=name,
        email=email,
        password=EMP_TEMP_PASSWORD,
        image_path=file_path,
        embedding=embedding_data["embedding"],
        facial_area=embedding_data["facial_area"],
        point_total=0,
        company_id=current_user["id"]
    )

    success = await save_employee(employee.model_dump())
    if not success:
        raise HTTPException(status_code=500, detail="Failed to add the employee")

    return {"name": employee.name}


@employee_router.post("/verify/")
async def verify_employee(image: UploadFile = File(...), current_user: dict = Depends(company_required)):
    temp_path = os.path.join(FRAME_DIR, image.filename)
    print(temp_path)
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    try:
        raw_results = DeepFace.represent(img_path=temp_path)
        if len(raw_results) > 1:
            return {
                "status": "error",
                "message": f"Multiple faces detected ({len(raw_results)} faces). Please provide an image with a single face."
            }

        raw_result = raw_results[0]
        embedding_data = format_embedding_result(raw_result)
        new_embedding = np.array(embedding_data["embedding"])
        facial_area = embedding_data["facial_area"]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Face not detected: {str(e)}")

    employees = await get_employees(current_user["id"])
    if not employees:
        return {"status": "No employees in database"}

    best_match = None
    best_score = -1  # cosine similarity (higher is better)
    threshold = 0.35

    for emp in employees:
        stored_embedding = np.array(emp["embedding"])
        score = cosine_similarity(stored_embedding, new_embedding)
        if score > best_score:
            best_score = score
            best_match = emp

    if best_score > threshold:

        return {
            "status": "Identified",
            "employee_id": best_match["employee_id"],
            "name": best_match["name"],
            "email": best_match.get("email"),
            "image_path": best_match.get("image_path"),
            "facial_area": facial_area
        }
    else:
        return {"status": "Not Identified", "facial_area": facial_area}


# ----------------------------
# Get all employees
# ----------------------------
@employee_router.get("/")
async def get_all_employees():
    employees = await get_employees()
    if not employees:
        return []

    result = [
        {
            "_id": str(emp.get("_id")),
            "name": emp.get("name"),
            "email": emp.get("email"),
            "image_path": emp.get("image_path"),
        }
        for emp in employees
    ]
    return result



# ----------------------------
# Delete employee
# ----------------------------
@employee_router.delete("/{employee_id}")
async def delete_employee(employee_id: str):
    from backend.crud.employee import delete_employee_db

    success = await delete_employee_db(employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found or deletion failed")

    return {"status": "Employee deleted successfully"}


# ----------------------------
# Update employee
# ----------------------------
@employee_router.put("/{employee_id}")
async def update_employee(
    employee_id: str,
    name: str = Form(None),
    email: str = Form(None),
    image: UploadFile = File(None)
):
    from backend.crud.employee import update_employee_db

    update_data = {}

    # Update image if provided
    if image:
        file_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        raw_result = DeepFace.represent(img_path=file_path)[0]
        embedding_data = format_embedding_result(raw_result)

        update_data.update({
            "image_path": file_path,
            "embedding": embedding_data["embedding"],
            "facial_area": embedding_data["facial_area"]
        })

    if name:
        update_data["name"] = name
    if email:
        update_data["email"] = email

    success = await update_employee_db(employee_id, update_data)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found or update failed")

    return {"status": "Employee updated successfully"}


@employee_router.get("/company_info", response_model=CompanyResponse)
async def get_company_info(current_user: dict = Depends(employee_required)):
    emp_id = current_user["id"]
    emp_info = await get_employee(emp_id)
    company_id = emp_info.get("company_id")
    if not company_id:
        raise HTTPException(status_code=404, detail="Company info not found for this employee")
    company_info = await get_info(company_id)
    return CompanyResponse.from_mongo(company_info)


def fix_objectid(data):
    """Recursively convert ObjectIds and datetime to JSON-safe strings."""
    if isinstance(data, dict):
        return {k: fix_objectid(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [fix_objectid(i) for i in data]
    elif isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, datetime):
        return data.isoformat()
    return data


@employee_router.get("/info", response_model=EmployeeResponse)
async def get_info(current_user: dict = Depends(employee_required)):
    info = await get_employee(current_user["id"])
    return EmployeeResponse.from_mongo(info)



def serialize_mongo(doc):
    """Recursively converts ObjectId to string in MongoDB documents."""
    if isinstance(doc, list):
        return [serialize_mongo(i) for i in doc]
    elif isinstance(doc, dict):
        return {k: serialize_mongo(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc


@employee_router.get("/dashboard", response_model=dict)
async def dashboard(current_user: dict = Depends(employee_required)):
    try:
        print("HIIII Dashboard emp ")

        employee_id = current_user["id"]

        employee_raw = await get_employee(employee_id)
        employee = EmployeeResponse.from_mongo(employee_raw)

        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

        print(employee.id)

        company_id = employee.company_id
        if not company_id:
            raise HTTPException(status_code=404, detail="Company not found")

        company_info_raw = await company_col.find_one({"_id": ObjectId(company_id)})
        if not company_info_raw:
            raise HTTPException(status_code=404, detail="Company info not found")
        company_info = CompanyResponse.from_mongo(company_info_raw)
        print(company_info)

        now = datetime.now()
        start_of_month = datetime(now.year, now.month, 1)
        if now.month < 12:
            end_of_month = datetime(now.year, now.month + 1, 1)
        else:
            end_of_month = datetime(now.year + 1, 1, 1)

        start_str = start_of_month.strftime("%Y-%m-%d")
        end_str = end_of_month.strftime("%Y-%m-%d")

        attendances = await attendance_col.find({
            "employee_email": employee.email,
            "attendance_date": {"$gte": start_str, "$lt": end_str}
        }).to_list(length=None)

        attendance_list = [
            {
                "date": a["attendance_date"],
                "present": a.get("present", False)
            }
            for a in attendances
        ]
        present_days = [a for a in attendances if a.get("present", False)]
        absent_days = [a for a in attendances if not a.get("present", False)]

        total_days = len(attendances)
        monthly_average_attendance = round((len(present_days) / total_days) * 100, 2) if total_days > 0 else 0

        present_count = len(present_days)
        absent_count = len(absent_days)

        today_str = date.today().isoformat()
        today_attendance = next((a for a in attendance_list if a["date"] == today_str), None)

        if not today_attendance and attendances:
            attendances_sorted = sorted(attendances, key=lambda x: x["attendance_date"], reverse=True)
            today_attendance = attendances_sorted[0]

        today_date = datetime.utcnow().date()
        tomorrow_date = today_date + timedelta(days=1)

        ppe_results = await ppe_col.find_one({
            "employee_email": employee.email,
            "timestamp": {
                "$gte": datetime.combine(today_date, datetime.min.time()),
                "$lt": datetime.combine(tomorrow_date, datetime.min.time())
            }
        })

        print(ppe_results)

        # Initialize variables with default values
        ppe_bar_chart = {}
        items_missed = []
        today_points = 0

        if ppe_results:
            ppe_bar_chart = {item: int(status) for item, status in ppe_results["ppe_result"].items() if
                             item != "person"}
            items_missed = [item for item, status in ppe_results["ppe_result"].items() if status is False]
            today_points = ppe_results.get("today_points", 0)

        print(ppe_bar_chart)

        # Collect all PPE results for the month
        ppe_results_list = await ppe_col.find({
            "employee_email": employee.email,
            "timestamp": {"$gte": start_of_month, "$lt": end_of_month}
        }).to_list(length=None)

        weekly_data = defaultdict(lambda: {
            "violations": 0,
            "missed_items_count": defaultdict(int),
            "true_count": defaultdict(int),
            "days_count": 0
        })

        for record in ppe_results_list:
            ts = record["timestamp"]
            week_num = ts.isocalendar()[1]

            weekly_data[week_num]["days_count"] += 1

            for item, status in record["ppe_result"].items():
                if item == "person":
                    continue
                if not status:
                    weekly_data[week_num]["violations"] += 1
                    weekly_data[week_num]["missed_items_count"][item] += 1
                else:
                    weekly_data[week_num]["true_count"][item] += 1

        weekly_summary = {}

        for week, data in weekly_data.items():
            if data["missed_items_count"]:
                most_missed_item = max(data["missed_items_count"], key=lambda x: data["missed_items_count"][x])

                if data["true_count"]:
                    best_compliance_item = max(data["true_count"], key=lambda x: data["true_count"][x])
                else:
                    best_compliance_item = None
            else:
                most_missed_item = None
                best_compliance_item = None

            weekly_summary[week] = {
                "violations": data["violations"],
                "most_missed_item": most_missed_item,
                "best_compliance_item": best_compliance_item,
                "days_count": data["days_count"],
                "bar_chart_data": dict(data["missed_items_count"])  # Convert defaultdict to dict
            }

        # Create response data and serialize it properly
        response_data = {
            "employee": {
                "name": employee.name,
                "email": employee.email,
                "total_point": employee.point_total
            },
            "company": {
                "name": company_info.name,
                "plan": company_info.plan,
                "email": company_info.email
            },
            "attendance": {
                "monthly_average": monthly_average_attendance,
                "present_count": present_count,
                "absent_count": absent_count,
                "today": today_attendance,
                "calender": attendance_list
            },
            "ppe": {
                "today_status": ppe_bar_chart,
                "items_missed": items_missed,
                "today_point": today_points,
                "weekly_summary": weekly_summary
            }
        }

        #  Serialize the response data
        serialized = serialize_mongo(response_data)
        return serialized

    except Exception as e:
        print(f"❌ Dashboard error: {e}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Dashboard error: {str(e)}")

