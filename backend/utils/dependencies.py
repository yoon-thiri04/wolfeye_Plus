from fastapi import Depends, HTTPException, status
from backend.utils.authentication import get_current_user

async def admin_required(current_user= Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

async def company_required(current_user=Depends(get_current_user)):
    if current_user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Company Privileges required"
        )
    return current_user


async def employee_required(current_user= Depends(get_current_user)):
    if current_user.get("role") != "employee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail ="Employee privileges required"
        )

    return current_user