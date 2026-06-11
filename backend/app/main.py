from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.config import ensure_data_files, get_cors_origins
from app.routers import generate_router, letters_router

ensure_data_files()

app = FastAPI(
    title="Letter Library API",
    description="REST API for browsing personal letter templates",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(letters_router)
app.include_router(generate_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
