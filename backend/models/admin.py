from pydantic import BaseModel
from datetime import datetime
from typing import Optional,Literal
from pydantic import BaseModel, Field, EmailStr

class AdminCreate(BaseModel):
    name: str
    email : str
    password: str = Field(default="admin123", max_length=72)
    role : Literal["admin"] = "admin"
    created_at : Optional[datetime] = datetime.now()
    updated_at : Optional[datetime] = datetime.now()

