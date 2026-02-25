"""Media gallery router — NASA Image & Video Library search."""

from fastapi import APIRouter, Query
from app.schemas import MediaItemResponse, MediaGalleryResponse
from app.services.nasa_media import search_nasa_media

router = APIRouter(prefix="/api/media", tags=["media"])


@router.get("", response_model=MediaGalleryResponse)
async def get_media(
    q: str = Query("space", min_length=1),
    page: int = Query(1, ge=1),
    media_type: str = Query(""),   # "" = all, "image", "video"
):
    """
    Search NASA Image & Video Library.
    Returns gallery items with thumbnails and video preview URLs.
    """
    result = await search_nasa_media(
        query=q,
        media_type=media_type if media_type else None,
        page=page,
        page_size=20,
    )

    items = [
        MediaItemResponse(
            id=idx + 1 + (page - 1) * 20,
            type=item["media_type"],
            title=item["title"],
            thumbnail=item["thumbnail"],
            videoUrl=item.get("video_url"),
        )
        for idx, item in enumerate(result["items"])
    ]

    return MediaGalleryResponse(
        items=items,
        total=result["total_hits"],
        page=page,
    )
