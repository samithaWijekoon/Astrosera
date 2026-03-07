from typing import Optional, List
from pydantic import BaseModel


# ─── Article / News ───────────────────────────────────────────────────

class ArticleResponse(BaseModel):
    """Shape consumed by the frontend news feed."""
    id: int
    title: str
    summary: str
    fullContent: str          # camelCase to match frontend
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


# ─── APOD ─────────────────────────────────────────────────────────────

class APODResponse(BaseModel):
    title: str
    date: str
    url: str
    hdurl: Optional[str] = None
    explanation: str
    media_type: str = "image"
    copyright: Optional[str] = None


# ─── Media Gallery ────────────────────────────────────────────────────

class MediaItemResponse(BaseModel):
    id: int
    type: str                 # "image" or "video"
    title: str
    thumbnail: str
    videoUrl: Optional[str] = None
    nasaId: Optional[str] = None

    class Config:
        from_attributes = True


class MediaGalleryResponse(BaseModel):
    items: List[MediaItemResponse]
    total: int
    page: int


# ─── Global Search ────────────────────────────────────────────────────

class SearchResultItem(BaseModel):
    resultType: str           # "article" or "media"
    id: int
    title: str
    summary: str
    image: str
    url: Optional[str] = None
    date: Optional[str] = None


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem]
    total: int
