from fastapi import APIRouter, HTTPException, status, Depends
from backend.models.admin import AdminCreate
from backend.crud.admin import create_admin, delete_admin, add_company, get_company_list, delete_company
from backend.utils.dependencies import admin_required
from backend.crud.auth import get_user_by_email
from backend.models.company import CompanyCreate, CompanyResponse

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

TEMPO_PASSWORD_ADMIN = "admin123"
TEMPO_PASSWORD_COMPANY = "companytempo@123!"


@admin_router.post("/create", response_model=dict)
async def add_admin(admin: AdminCreate):
    existing_admin = await get_user_by_email(admin.email)
    if existing_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this mail already exists!")

    admin_with_password = admin.copy(update={"password": TEMPO_PASSWORD_ADMIN})
    result = await create_admin(admin_with_password)

    return {
        "message": "Admin Added!"
    }


@admin_router.delete("/delete", response_model=dict)
async def delete_admin_api(admin_id: str):
    result = await delete_admin(admin_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin Not found!")

    return {"message": "Successfully Deleted!"}


@admin_router.post("/add_company", response_model=dict)
async def add_company_api(company: CompanyCreate, current_user: dict = Depends(admin_required)):
    existing_company = await get_user_by_email(company.email)
    if existing_company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this mail already exists!")

    company_with_password = company.copy(update={"password": TEMPO_PASSWORD_COMPANY})
    result = await add_company(company_with_password)
    return {
        "message": "Company Added!"
    }


@admin_router.get("/company_list", response_model=list[CompanyResponse])
async def view_company_list(current_user: dict = Depends(admin_required)):
    company_list = await get_company_list()
    return [CompanyResponse.from_mongo(company) for company in company_list]


@admin_router.delete("/delete_company", response_model=dict)
async def delete_company_api(company_id: str, current_user: dict = Depends(admin_required)):
    result = await delete_company(company_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company Not found!")

    return {"message": "Successfully Deleted!"}


