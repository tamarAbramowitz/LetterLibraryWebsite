from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routers import generate_router, letters_router

app = FastAPI(
    title="Letter Library API",
    description="REST API for browsing personal letter templates",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(letters_router)
app.include_router(generate_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
