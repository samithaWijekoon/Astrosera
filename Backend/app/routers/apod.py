"""APOD router — Astronomy Picture of the Day with caching."""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import APODResponse
from app.services.cache import get_or_fetch_apod

router = APIRouter(prefix="/api/apod", tags=["apod"])


@router.get("", response_model=APODResponse)
async def get_apod(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Get today's Astronomy Picture of the Day.
    Returns cached version if already fetched today.
    """
    result = await get_or_fetch_apod(db, background_tasks)
    if not result:
        raise HTTPException(
            status_code=503,
            detail="Unable to fetch APOD. Please try again later.",
        )

    return APODResponse(
        title=result["title"],
        date=result["date"],
        url=result["url"],
        hdurl=result.get("hdurl"),
        explanation=result["explanation"],
        media_type=result.get("media_type", "image"),
        copyright=result.get("copyright"),
    )
