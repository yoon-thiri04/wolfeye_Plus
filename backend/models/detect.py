from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DetectRequest(BaseModel):
    image: str
    session_id: str


class StartSessionRequest(BaseModel):
    person_id: str

class PPEResult(BaseModel):
    helmet: bool
    gloves: bool
    vest: bool
    goggles: bool
    ear_protection: bool
    person: bool

class PPERecordCreate(BaseModel):
    employee_email: str
    company_id:str
    ppe_result: PPEResult
    timestamp: Optional[datetime] = None
    today_points: int
    compliance_status : str

class EndDetectRequest(BaseModel):
    end: bool
