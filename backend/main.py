from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Lawind AI API",
    description="AI-powered legal intelligence platform for the Indian legal ecosystem",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8600"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Lawind AI API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
