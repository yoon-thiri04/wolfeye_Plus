from fastapi import APIRouter, HTTPException, status, Depends
from backend.models.auth import ChangePassword, UserLogin
from backend.crud.auth import change_password, get_user_by_email
from backend.utils.authentication import generate_jwt_token, get_current_user
from backend.utils.password import verify_pwd
from backend.db import db

router = APIRouter(prefix="", tags=["Authentication"])
employee_col = db["employee"]


@router.post("/login", response_model=dict)
async def login(user: UserLogin):
    print(f"Login attempt for: {user.email}")

    # First, try to find user in company users collection
    db_user = await get_user_by_email(user.email)
    user_type = "company"

    # If not found in company users, try employee collection
    if not db_user:
        db_user = await db.employee.find_one({"email": user.email})
        user_type = "employee"
        print(f"Found in employee collection: {db_user is not None}")

    # Debug logging
    print(f"User found: {db_user is not None}")
    if db_user:
        print(f"User type: {user_type}")
        print(f"Has password field: {'password' in db_user}")
        if 'password' in db_user:
            print(f"Password field length: {len(db_user['password'])}")

    if not db_user:
        print("User not found in any collection")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials!"
        )

    if "password" not in db_user:
        print("Password field missing in user document")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Password not configured!"
        )

    # Verify password
    password_valid = verify_pwd(user.password, db_user["password"])
    print(f"Password verification: {password_valid}")

    if not password_valid:
        print("Password verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials!"
        )

    print("Login successful!")

    # Generate token with user type information
    if user_type == "employee":
        token_data = {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"],
            "role": "employee",
            "employee_id": db_user.get("employee_id"),
            "company_id": db_user.get("company_id")
        }

        response_data = {
            "message": "login success",
            "token": generate_jwt_token(token_data),
            "user_type": user_type,
            "employee": {
                "id": str(db_user["_id"]),
                "employee_id": db_user.get("employee_id"),
                "name": db_user["name"],
                "email": db_user["email"],
                "company_id": db_user.get("company_id"),
                "role": "employee",
                "point_total": db_user.get("point_total", 0),
                "image_path": db_user.get("image_path", "")
            }
        }
    else:
        token_data = {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"]
        }

        response_data = {
            "message": "login success",
            "token": generate_jwt_token(token_data),
            "user_type": user_type,
            "user": {
                "id": str(db_user["_id"]),
                "name": db_user["name"],
                "email": db_user["email"],
                "role": db_user["role"]
            }
        }

    return response_data

@router.put("/change_pwd", response_model=dict)
async def change_pwd(update_data: ChangePassword, current_user=Depends(get_current_user)):
    user_id = current_user["id"]

    result = await change_password(user_id, update_data, current_user["role"])
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found!")

    return {"message": "Password Change Successfully!"}

