from backend.models.auth import ChangePassword, UserLogin
from backend.db import db
from fastapi import HTTPException, status
from backend.utils.password import hash_pwd, verify_pwd
from bson import ObjectId

admin_collection = db["admin"]
employee_collection = db["employee"]
company_collection = db["company"]


async def get_user_by_email(email):
    for collection in [admin_collection, company_collection, employee_collection]:
        user = await collection.find_one({"email": email})
        if user:
            return user
    return None


async def change_password(id: str, update_data: ChangePassword, role: str):
    if role == "admin":
        collection = admin_collection
    elif role == "employee":
        collection = employee_collection
    elif role == "company":
        collection = company_collection
    else:
        raise HTTPException(status_code=400, detail="Invalid role!")

    user = await collection.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")

    # Verify old password
    if not verify_pwd(update_data.old_pwd, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Old password is incorrect!"
        )

    # Check new password confirmation
    if update_data.new_pwd != update_data.confirm_pwd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New passwords do not match!"
        )

    hashed_password = hash_pwd(update_data.new_pwd)

    result = await collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"password": hashed_password}}
    )

    if result.modified_count > 0:
        return {"message": "Password updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update password!")
