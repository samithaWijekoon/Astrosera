"""News feed router — paginated, filterable, sortable articles."""

from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.database import get_db, SessionLocal
from app.models import Article
from app.schemas import ArticleResponse, NewsFeedResponse
from app.services.cache import refresh_news_if_stale

router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("", response_model=NewsFeedResponse)
async def get_news(
    background_tasks: BackgroundTasks,
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1, le=50),
    category: str = Query("all"),
    sort: str = Query("date"),   # "date" or "relevance"
    search: str = Query(""),
    db: Session = Depends(get_db),
):
    """
    Paginated news feed with category filtering, sorting and search.
    Automatically refreshes content from NASA RSS if cache is stale.
    """
    async def background_refresh_news():
        bg_db = SessionLocal()
        try:
            await refresh_news_if_stale(bg_db)
        finally:
            bg_db.close()

    # Refresh cache if needed in the background
    background_tasks.add_task(background_refresh_news)

    query = db.query(Article)

    # Category filter
    if category and category != "all":
        query = query.filter(Article.category == category)

    # Search filter
    if search:
        search = search.strip()
        if len(search) < 3:
            return NewsFeedResponse(
                articles=[],
                total=0,
                page=page,
                limit=limit,
                hasMore=False,
            )
            
        pattern = f"%{search}%"
        query = query.filter(
            (Article.title.ilike(pattern))
            | (Article.summary.ilike(pattern))
            | (Article.source.ilike(pattern))
        )

    # Sorting
    if sort == "date":
        query = query.order_by(desc(Article.date))
    else:
        # Relevance: trending first, then by date
        query = query.order_by(desc(Article.trending), desc(Article.date))

    total = query.count()
    offset = (page - 1) * limit
    articles = query.offset(offset).limit(limit).all()

    items = [
        ArticleResponse(
            id=a.id,
            title=a.title,
            summary=a.summary or "",
            fullContent=a.full_content or a.summary or "",
            source=a.source or "NASA",
            date=a.date or "",
            category=a.category or "missions",
            image=a.image_url or "",
            url=a.url or "",
            readingTime=a.reading_time or 3,
            trending=a.trending or False,
        )
        for a in articles
    ]

    return NewsFeedResponse(
        articles=items,
        total=total,
        page=page,
        limit=limit,
        hasMore=(offset + limit) < total,
    )
