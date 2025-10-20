from pydantic import BaseModel

class ChangePassword(BaseModel):
    old_pwd :str
    new_pwd : str
    confirm_pwd :str

class UserLogin(BaseModel):
    email: str
    password : str

