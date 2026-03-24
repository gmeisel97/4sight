from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from config import settings

app = FastAPI(
    title="4sight API",
    description="Cursor for Excel — AI-powered spreadsheet editing with cell-level diffs",
    version="0.1.0"
)

# Allow the frontend (running on a different port) to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"status": "4sight is running", "version": "0.1.0"}
