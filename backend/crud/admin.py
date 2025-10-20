from backend.models.admin import AdminCreate
from backend.models.company import CompanyCreate
from backend.db import db
from fastapi import HTTPException, status
from backend.utils.password import hash_pwd, verify_pwd
from bson import ObjectId

admin_collection = db["admin"]
company_collection = db["company"]


async def create_admin(admin: AdminCreate):
    hashed_password = hash_pwd(admin.password)
    admin_data = admin.model_dump()
    admin_data['password'] = hashed_password

    try:
        result = await admin_collection.insert_one(admin_data)

        admin_data["_id"] = str(result.inserted_id)
        return admin_data
    except Exception as e:
        print("Error creating admin:", e)
        return None


async def delete_admin(admin_id: str):
    result = await admin_collection.delete_one(
        {"_id": ObjectId(admin_id)}
    )
    return result.deleted_count > 0


async def add_company(company: CompanyCreate):
    hashed_password = hash_pwd(company.password)
    company_data = company.model_dump()
    company_data['password'] = hashed_password

    try:
        result = await company_collection.insert_one(company_data)

        company_data["_id"] = str(result.inserted_id)
        return company_data
    except Exception as e:
        print("Error creating admin:", e)
        return None


async def get_company_list():
    companies = await company_collection.find().to_list()
    return companies


async def delete_company(company_id: str):
    result = await company_collection.delete_one({"_id": ObjectId(company_id)})
    doc = await company_collection.find_one({"_id": ObjectId(company_id)})
    print(doc)

    return result.deleted_count > 0