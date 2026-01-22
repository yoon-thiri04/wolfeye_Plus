import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from backend.routes.employee import employee_router
from backend.routes.auth import router
from backend.routes.admin import admin_router
from backend.routes.company import company_router
from backend.routes.iot import iot_router
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.ppe_detection import detect_router, r
from backend.db import db

from fastapi.responses import FileResponse

app = FastAPI(
    title="WolfEye Plus API",
    description="API for WolfEye Plus Employee Monitoring and Safety System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

origins = [
    "http://localhost:5173",
    "http://localhost",
    "http://localhost:80",
    "http://localhost:8090"
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
    # Mount assets folder if it exists (Vite build output usually has an assets folder)
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Prevent API and Docs 404s from returning the React App
        if full_path.startswith(("api", "docs", "redoc", "openapi.json")):
            raise HTTPException(status_code=404, detail="Not Found")

        # Serve static files if they exist
        path = os.path.join(frontend_dist, full_path)
        if os.path.exists(path) and os.path.isfile(path):
            return FileResponse(path)
        
        # Fallback to index.html for SPA routing
        return FileResponse(os.path.join(frontend_dist, "index.html"))

@app.on_event("startup")
async def startup_event():
    print("=== REGISTERED ROUTES ===")
    for route in app.routes:
        if hasattr(route, "methods"):
            print(f"{route.methods} {route.path}")
        else:
            print(f"Static/Mount: {route.path}")
    print("=========================")

