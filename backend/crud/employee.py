from fastapi import HTTPException,status
from datetime import date
from backend.db import db
from backend.models.employee import EmployeeCreate,Attendance
from typing import Dict
from bson import ObjectId
from backend.utils.password import hash_pwd

employee_col = db["employee"]
attendance_col= db["attendance"]

# ----------------------------
# Save employee
# ----------------------------
async def save_employee(employee_data: Dict) -> bool:
    # hash the password before saving
    if "password" in employee_data:
        hashed_password = hash_pwd(employee_data["password"])
        employee_data['password'] = hashed_password
        print(f"Password hashed: {employee_data['password'][:20]}...")

    try:
        result = await db.employee.insert_one(employee_data)
        print(f"Employee saved with ID: {result.inserted_id}")
        return True
    except Exception as e:
        print(f"Error saving employee: {e}")
        return False

# ----------------------------
# Get all employees
# ----------------------------
async def get_employees(company_id:str):
    employees = await employee_col.find({"company_id":company_id}).to_list()
    if not employees:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employees with this company had not been placed!")

    return employees

# ----------------------------
# Update employee
# ----------------------------
async def update_employee_db(employee_id: str, update_data: Dict) -> bool:
    try:
        result = await employee_col.update_one(
            {"_id": ObjectId(employee_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error updating employee: {e}")
        return False

# ----------------------------
# Delete employee
# ----------------------------
async def delete_employee_db(employee_id: str) -> bool:
    try:
        result = await employee_col.delete_one(
            {"_id": ObjectId(employee_id)}
        )
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error deleting employee: {e}")
        return False



# ----------------------------
# marked attendance employee
# ----------------------------

async def marked_attended(emp:Attendance):
    attendance_data = emp.model_dump()
    print(attendance_data)
    today = date.today().isoformat()
    attendance_data["attendance_date"] =today
    existing = await attendance_col.find_one({
        "employee_email": attendance_data["employee_email"],
        "attendance_date": today
    })
    if existing:
        return {"status": "Already marked today"}

    try:
        await attendance_col.insert_one(attendance_data)
        return True
    except Exception as e:
        print(f"Error inserting into attendance table: {e}")
        return False


# ----------------------------
# get attendance list
# ----------------------------
async def get_attendance_list(company_id:str):
    today = date.today().isoformat()
    emp_list = await attendance_col.find({
        "company_id": company_id,
        "attendance_date": today
    }).to_list()

    return emp_list


async def get_employee(employee_id:str):
    employee = await employee_col.find_one({"_id":ObjectId(employee_id)})
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee with this id had not been placed!")

    return employee


async def get_attendance(employee_email:str):
    attendance = await attendance_col.find({"employee_email":employee_email}).to_list()

    if not attendance:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not exist attendance")

    return attendance