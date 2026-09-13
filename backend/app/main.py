from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.contact import router as contact_router
from app.api.routes.content import router as content_router

app = FastAPI(
    title="NOVATECH API",
    version="1.0.0",
)

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

app.include_router(contact_router)
app.include_router(content_router)


@app.get("/")
def root():
    return {
        "message": "NOVATECH API is running"
    }