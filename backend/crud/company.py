from backend.db import db
from bson import ObjectId

company_col = db["company"]
async def get_info(company_id:str):
    company = await company_col.find_one({"_id":ObjectId(company_id)})
    if company:
        return company
    else:
        return None