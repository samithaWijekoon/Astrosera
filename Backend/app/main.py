"""AstroSera Content Aggregation API — FastAPI entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db, SessionLocal
from app.routers import news, apod, media, search
from app.services.scraper import scrape_nasa_feeds


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables and trigger initial scrape."""
    print("🚀 Starting AstroSera Content API...")
    init_db()

    # Initial scrape on startup (non-blocking best-effort)
    try:
        db = SessionLocal()
        count = await scrape_nasa_feeds(db)
        print(f"✅ Initial scrape complete — {count} new articles.")
        db.close()
    except Exception as exc:
        print(f"⚠️  Initial scrape failed (will retry on first request): {exc}")

    yield

    print("👋 Shutting down AstroSera Content API.")


app = FastAPI(
    title="AstroSera Content API",
    description="Backend API for the AstroSera space news & media aggregator.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────
app.include_router(news.router)
app.include_router(apod.router)
app.include_router(media.router)
app.include_router(search.router)


@app.get("/")
async def root():
    return {
        "message": "🌌 AstroSera Content API is running!",
        "docs": "/docs",
        "endpoints": {
            "news": "/api/news",
            "apod": "/api/apod",
            "media": "/api/media?q=space",
            "search": "/api/search?q=mars",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
