from typing import Optional, List
from pydantic import BaseModel


class ArticleResponse(BaseModel):
    """Shape consumed by the frontend news feed."""
    id: int
    title: str
    summary: str
    fullContent: str
    source: str
    date: str
    category: str
    image: str
    url: str
    readingTime: int
    trending: bool = False

    class Config:
        from_attributes = True


class NewsFeedResponse(BaseModel):
    articles: List[ArticleResponse]
    total: int
    page: int
    limit: int
    hasMore: bool
