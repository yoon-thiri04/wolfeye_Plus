import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.routes.employee import employee_router
from backend.routes.auth import router
from backend.routes.admin import admin_router
from backend.routes.company import company_router
from backend.routes.iot import iot_router
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.ppe_detection import detect_router, r
from backend.db import db

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost",
    "http://localhost:80"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    health_status = {"status": "ok", "services": {}}
    
    # Check MongoDB
    try:
        await db.command("ping")
        health_status["services"]["mongodb"] = "up"
    except Exception as e:
        health_status["services"]["mongodb"] = f"down: {str(e)}"
        health_status["status"] = "error"

    # Check Redis
    try:
        r.ping()
        health_status["services"]["redis"] = "up"
    except Exception as e:
        health_status["services"]["redis"] = f"down: {str(e)}"
        health_status["status"] = "error"
        
    return health_status

app.include_router(employee_router, prefix="/api/employee")
app.include_router(detect_router, prefix="/api")
app.include_router(router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(company_router, prefix="/api/company")
app.include_router(iot_router, prefix="/api")

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.isdir(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

@app.on_event("startup")
async def startup_event():
    print("=== REGISTERED ROUTES ===")
    for route in app.routes:
        if hasattr(route, "path"):
            print(f"{route.methods} {route.path}")
    print("=========================")

