import asyncio
import sys
import os

# Add the parent directory to sys.path to allow imports from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import db
from backend.utils.password import hash_pwd
from datetime import datetime

async def seed():
    print("Seeding users...")
    
    # 1. Admin
    admin_email = "admin@wolfeye.com"
    admin_pass = "password"
    
    admin = await db.admin.find_one({"email": admin_email})
    if not admin:
        print(f"Creating Admin: {admin_email}")
        await db.admin.insert_one({
            "name": "Super Admin",
            "email": admin_email,
            "password": hash_pwd(admin_pass),
            "role": "admin",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        })
    else:
        print(f"Admin exists: {admin_email}")

    # 2. Company
    company_email = "company@wolfeye.com"
    company_pass = "password"
    
    company = await db.company.find_one({"email": company_email})
    if not company:
        print(f"Creating Company: {company_email}")
        res = await db.company.insert_one({
            "name": "WolfEye Corp",
            "email": company_email,
            "password": hash_pwd(company_pass),
            "role": "company",
            "plan": "premium",
            "created_at": datetime.now()
        })
        company_id = str(res.inserted_id)
    else:
        print(f"Company exists: {company_email}")
        company_id = str(company["_id"])

    # 3. Employee
    employee_email = "employee@wolfeye.com"
    employee_pass = "password"
    
    employee = await db.employee.find_one({"email": employee_email})
    if not employee:
        print(f"Creating Employee: {employee_email}")
        # Dummy embedding (DeepFace VGG-Face is typically 4096)
        dummy_embedding = [0.0] * 4096
        
        await db.employee.insert_one({
            "employee_id": "EMP001",
            "name": "John Doe",
            "email": employee_email,
            "password": hash_pwd(employee_pass),
            "company_id": company_id,
            "role": "employee",
            "point_total": 0,
            "embedding": dummy_embedding,
            "facial_area": {"x": 0, "y": 0, "w": 0, "h": 0},
            "image_path": "dummy_path.jpg",
            "created_at": datetime.now()
        })
    else:
        print(f"Employee exists: {employee_email}")

    print("\n--- Credentials ---")
    print(f"Admin:    {admin_email} / {admin_pass}")
    print(f"Company:  {company_email} / {company_pass}")
    print(f"Employee: {employee_email} / {employee_pass}")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed())
