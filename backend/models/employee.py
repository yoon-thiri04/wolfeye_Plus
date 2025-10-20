from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Literal
from datetime import date


class Attendance(BaseModel):
    employee_email: str
    company_id: str
    attendance_date: date = Field(default_factory=date.today)
    present: bool


class EmployeeCreate(BaseModel):
    employee_id: str
    name: str
    email: str
    password: str
    company_id: str
    point_total: int
    role: Literal["employee"] = "employee"
    embedding: List[float]
    facial_area: Optional[Dict[str, int]] = None
    image_path: str


class EmployeeResponse(BaseModel):
    id: str
    employee_id: str
    name: str
    email: str
    company_id: str
    role: str
    image_path: str
    point_total: int

    @classmethod
    def from_mongo(cls, employee):
        return cls(
            id=str(employee["_id"]),
            employee_id=employee["employee_id"],
            name=employee["name"],
            email=employee["email"],
            company_id=employee["company_id"],
            role=employee["role"],
            image_path=employee["image_path"],
            point_total=employee["point_total"]
        )


