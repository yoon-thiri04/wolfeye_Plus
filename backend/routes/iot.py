from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import redis
import os
import json

iot_router = APIRouter(prefix="/iot", tags=["IoT"])

# Redis connection (reuse existing connection settings)
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)

class UnlockRequest(BaseModel):
    device_id: str
    duration: int = 5000  # milliseconds

class LockRequest(BaseModel):
    device_id: str
    duration: int = 5000

@iot_router.post("/trigger_unlock")
async def trigger_unlock(req: UnlockRequest):
    """
    Called by the frontend/admin panel to request a door unlock.
    Sets a flag in Redis that the ESP8266 will poll.
    """
    # Key format: iot:unlock:{device_id}
    key = f"iot:unlock:{req.device_id}"
    
    # Set the key with a short expiration (e.g., 10 seconds)
    # The value 'true' indicates pending unlock command
    r.set(key, "true", ex=10)
    
    return {"status": "success", "message": f"Unlock command sent to {req.device_id}"}

@iot_router.post('/trigger_lock')
async def trigger_lock(req: LockRequest):
    """
    Called by the frontend/admin panel to request a door lock.
    Sets a flag in Redis that the ESP8266 will poll.
    """
    # Key format: iot:lock:{device_id}
    key = f"iot:lock:{req.device_id}"
    
    # Set the key with a short expiration (e.g., 10 seconds)
    # The value 'true' indicates pending lock command
    r.set(key, "true", ex=10)
    
    return {"status": "success", "message": f"Lock command sent to {req.device_id}"}


@iot_router.get("/check_access")
async def check_access(device_id: str):
    """
    Polled by ESP8266 to check if it should unlock or lock.
    """
    unlock_key = f"iot:unlock:{device_id}"
    lock_key = f"iot:lock:{device_id}"
    should_unlock = r.get(unlock_key)
    should_lock = r.get(lock_key)
    
    if should_unlock == "true":
        # Delete key so it only unlocks once per request
        r.delete(unlock_key)
        return {"unlock": True, "duration": 5000}
    
    if should_lock == "true":
        r.delete(lock_key)
        return {"unlock": False, "force_lock": True}
    
    return {"unlock": False, "force_lock": False}
