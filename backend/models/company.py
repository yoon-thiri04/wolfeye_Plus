from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal


class CompanyCreate(BaseModel):
    name: str
    email: str
    plan: str
    role: Literal["company"] = "company"
    created_at: Optional[datetime] = datetime.now()


class CompanyResponse(BaseModel):
    id: str
    name: str
    email: str
    plan: str
    role: str
    created_at: datetime

    @classmethod
    def from_mongo(cls, company):
        return cls(
            id=str(company["_id"]),
            name=company["name"],
            email=company["email"],
            plan=company["plan"],
            role=company["role"],
            created_at=company["created_at"]
        )
