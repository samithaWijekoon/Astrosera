"""Caching helpers — orchestrate fetch-or-cache for APOD and news."""

from datetime import datetime, timedelta

from sqlalchemy.orm import Session
from fastapi import BackgroundTasks

from app.database import SessionLocal

from app.config import APOD_CACHE_DURATION, NEWS_CACHE_DURATION
from app.models import APODCache, ScrapeMeta
from app.services.nasa_apod import fetch_apod_from_nasa
from app.services.scraper import scrape_nasa_feeds


async def get_or_fetch_apod(db: Session, background_tasks: BackgroundTasks) -> dict | None:
    """
    Return today's APOD from cache if available. If not, return latest cached
    and fetch today's APOD in the background.
    """
    today = datetime.utcnow().strftime("%Y-%m-%d")

    cached = db.query(APODCache).filter(APODCache.date == today).first()
    if cached:
        return {
            "title": cached.title,
            "date": cached.date,
            "url": cached.url,
            "hdurl": cached.hdurl,
            "explanation": cached.explanation,
            "media_type": cached.media_type,
            "copyright": cached.copyright,
        }

    # Fetch latest as fallback
    fallback = (
        db.query(APODCache).order_by(APODCache.date.desc()).first()
    )

    async def background_fetch_apod():
        bg_db = SessionLocal()
        try:
            existing = bg_db.query(APODCache).filter(APODCache.date == today).first()
            if existing: return

            data = await fetch_apod_from_nasa()
            if data:
                entry = APODCache(
                    title=data.get("title", "Untitled"),
                    explanation=data.get("explanation", ""),
                    url=data.get("url", ""),
                    hdurl=data.get("hdurl"),
                    date=data.get("date", today),
                    media_type=data.get("media_type", "image"),
                    copyright=data.get("copyright"),
                )
                bg_db.add(entry)
                bg_db.commit()
        finally:
            bg_db.close()

    if fallback:
        # We have a fallback, trigger background fetch and return fallback immediately
        background_tasks.add_task(background_fetch_apod)
        return {
            "title": fallback.title,
            "date": fallback.date,
            "url": fallback.url,
            "hdurl": fallback.hdurl,
            "explanation": fallback.explanation,
            "media_type": fallback.media_type,
            "copyright": fallback.copyright,
        }

    # If no fallback at all, we MUST fetch synchronously and wait
    data = await fetch_apod_from_nasa()
    if not data:
        return None

    # Store in cache
    entry = APODCache(
        title=data.get("title", "Untitled"),
        explanation=data.get("explanation", ""),
        url=data.get("url", ""),
        hdurl=data.get("hdurl"),
        date=data.get("date", today),
        media_type=data.get("media_type", "image"),
        copyright=data.get("copyright"),
    )
    db.add(entry)
    db.commit()

    return {
        "title": entry.title,
        "date": entry.date,
        "url": entry.url,
        "hdurl": entry.hdurl,
        "explanation": entry.explanation,
        "media_type": entry.media_type,
        "copyright": entry.copyright,
    }


async def refresh_news_if_stale(db: Session) -> int:
    """
    Check if news is stale (>1 hour since last scrape) and re-scrape.
    Returns number of new articles.
    """
    meta = (
        db.query(ScrapeMeta)
        .order_by(ScrapeMeta.last_scraped_at.desc())
        .first()
    )

    stale_threshold = datetime.utcnow() - timedelta(seconds=NEWS_CACHE_DURATION)

    if meta and meta.last_scraped_at and meta.last_scraped_at > stale_threshold:
        return 0  # Still fresh

    return await scrape_nasa_feeds(db)
