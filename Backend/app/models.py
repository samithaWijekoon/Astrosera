from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float

from app.database import Base


class Article(Base):
    """Cached news articles from NASA blogs/RSS feeds."""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_id = Column(String(255), unique=True, nullable=True, index=True)
    title = Column(String(500), nullable=False)
    summary = Column(Text, nullable=True)
    full_content = Column(Text, nullable=True)
    source = Column(String(200), nullable=True)
    date = Column(String(50), nullable=True)           # ISO date string
    category = Column(String(100), default="missions")
    image_url = Column(String(1000), nullable=True)
    url = Column(String(1000), nullable=True)
    reading_time = Column(Integer, default=3)
    trending = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class APODCache(Base):
    """Cached NASA Astronomy Picture of the Day entries."""
    __tablename__ = "apod_cache"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(500), nullable=False)
    explanation = Column(Text, nullable=True)
    url = Column(String(1000), nullable=True)
    hdurl = Column(String(1000), nullable=True)
    date = Column(String(20), unique=True, index=True)  # YYYY-MM-DD
    media_type = Column(String(50), default="image")
    copyright = Column(String(300), nullable=True)
    cached_at = Column(DateTime, default=datetime.utcnow)


class MediaItem(Base):
    """Cached media items from NASA Image & Video Library."""
    __tablename__ = "media_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nasa_id = Column(String(255), unique=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    media_type = Column(String(50), default="image")     # image / video
    thumbnail_url = Column(String(1000), nullable=True)
    media_url = Column(String(1000), nullable=True)
    date_created = Column(String(50), nullable=True)
    center = Column(String(200), nullable=True)
    cached_at = Column(DateTime, default=datetime.utcnow)


class ScrapeMeta(Base):
    """Tracks when each feed was last scraped."""
    __tablename__ = "scrape_meta"

    id = Column(Integer, primary_key=True, autoincrement=True)
    feed_url = Column(String(1000), unique=True, nullable=False)
    last_scraped_at = Column(DateTime, default=datetime.utcnow)
