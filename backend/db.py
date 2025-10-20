from backend.config import MongoConfig
from motor.motor_asyncio import AsyncIOMotorClient

_client = AsyncIOMotorClient(MongoConfig.MONGO_URI)
db = _client[MongoConfig.MONGO_DB_NAME]