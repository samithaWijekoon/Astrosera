"""Caching helpers — orchestrate fetch-or-cache for APOD and news."""

from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.config import APOD_CACHE_DURATION, NEWS_CACHE_DURATION
from app.models import APODCache, ScrapeMeta
from app.services.nasa_apod import fetch_apod_from_nasa
from app.services.scraper import scrape_nasa_feeds


async def get_or_fetch_apod(db: Session) -> dict | None:
    """
    Return today's APOD from cache if available, otherwise fetch and cache.
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

    # Fetch from NASA
    data = await fetch_apod_from_nasa()
    if not data:
        # Return latest cached entry as fallback
        fallback = (
            db.query(APODCache).order_by(APODCache.date.desc()).first()
        )
        if fallback:
            return {
                "title": fallback.title,
                "date": fallback.date,
                "url": fallback.url,
                "hdurl": fallback.hdurl,
                "explanation": fallback.explanation,
                "media_type": fallback.media_type,
                "copyright": fallback.copyright,
            }
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
