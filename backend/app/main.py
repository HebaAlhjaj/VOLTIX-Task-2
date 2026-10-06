from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import Base, engine

# Existing models
from app.models.customer_request import CustomerRequest
from app.models.file import File

# Project management models
from app.models.client import Client
from app.models.project import Project
from app.models.project_member import ProjectMember

# Existing API routes
from app.api.routes.contact import router as contact_router
from app.api.routes.content import router as content_router
from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.services import router as services_router
from app.api.routes.requests import router as requests_router
from app.api.routes.files import router as files_router
from app.api.routes.clients import router as clients_router
from app.api.routes.projects import router as projects_router
from app.api.routes.team_members import router as team_members_router
app = FastAPI(
    title="NOVATECH API",
    version="1.0.0",
)


# Create database tables
Base.metadata.create_all(bind=engine)


# CORS - Allow React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Routes
app.include_router(contact_router)
app.include_router(content_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(services_router)
app.include_router(requests_router)
app.include_router(files_router)
app.include_router(clients_router)
app.include_router(team_members_router)
app.include_router(projects_router)
@app.get("/")
def root():
    return {
        "message": "NOVATECH API is running"
    }