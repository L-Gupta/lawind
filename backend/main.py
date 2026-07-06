from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from core.database import init_db
from core.seed import seed_founders
from models import waitlist as _waitlist_model  # noqa: F401 - registers table with Base metadata
from routers.auth import router as auth_router
from routers.waitlist import router as waitlist_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_founders()
    yield


app = FastAPI(
    title="Lawind AI API",
    description="AI-powered legal intelligence platform for the Indian legal ecosystem",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(waitlist_router)


@app.get("/")
async def root():
    return {"message": "Lawind AI API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/ping")
async def ping():
    return {
        "pong": True,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
