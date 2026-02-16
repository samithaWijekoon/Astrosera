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
    date = Column(String(50), nullable=True)
    category = Column(String(100), default="missions")
    image_url = Column(String(1000), nullable=True)
    url = Column(String(1000), nullable=True)
    reading_time = Column(Integer, default=3)
    trending = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
