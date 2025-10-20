from fastapi import FastAPI
from backend.routes.employee import employee_router
from backend.routes.auth import router
from backend.routes.admin import admin_router
from backend.routes.company import company_router
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.ppe_detection import detect_router

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee_router, prefix="/employee")
app.include_router(detect_router)
app.include_router(router)
app.include_router(admin_router)
app.include_router(company_router, prefix="/company")

@app.on_event("startup")
async def startup_event():
    print("=== REGISTERED ROUTES ===")
    for route in app.routes:
        if hasattr(route, "path"):
            print(f"{route.methods} {route.path}")
    print("=========================")

