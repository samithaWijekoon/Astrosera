"""Global search router — searches cached articles + NASA media."""

from fastapi import APIRouter, Depends, Query as QParam
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Article
from app.schemas import SearchResultItem, SearchResponse
from app.services.nasa_media import search_nasa_media

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("", response_model=SearchResponse)
async def global_search(
    q: str = QParam("", min_length=1),
    db: Session = Depends(get_db),
):
    """
    Search across cached articles and NASA media library.
    Returns combined results tagged by type.
    """
    results = []

    # 1. Search local articles
    if q:
        pattern = f"%{q}%"
        articles = (
            db.query(Article)
            .filter(
                (Article.title.ilike(pattern))
                | (Article.summary.ilike(pattern))
                | (Article.full_content.ilike(pattern))
            )
            .order_by(Article.date.desc())
            .limit(10)
            .all()
        )
        for a in articles:
            results.append(
                SearchResultItem(
                    resultType="article",
                    id=a.id,
                    title=a.title,
                    summary=a.summary or "",
                    image=a.image_url or "",
                    url=a.url,
                    date=a.date,
                )
            )

    # 2. Search NASA media library
    if q:
        media = await search_nasa_media(query=q, page=1, page_size=10)
        for idx, item in enumerate(media["items"]):
            results.append(
                SearchResultItem(
                    resultType="media",
                    id=1000 + idx,
                    title=item["title"],
                    summary=item["description"][:200] if item["description"] else "",
                    image=item["thumbnail"],
                    url=item.get("video_url"),
                    date=item.get("date_created"),
                )
            )

    return SearchResponse(
        query=q,
        results=results,
        total=len(results),
    )
