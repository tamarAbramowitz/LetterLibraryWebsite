from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import letters_router

app = FastAPI(
    title="Letter Library API",
    description="REST API for browsing personal letter templates",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(letters_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
