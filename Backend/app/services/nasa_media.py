"""NASA Image & Video Library API client."""

from typing import List, Dict, Tuple
import time

import httpx

from app.config import NASA_IMAGES_API_URL

MEDIA_CACHE: Dict[str, Tuple[float, dict]] = {}
CACHE_TTL = 3600  # 1 hour



async def search_nasa_media(
    query: str = "space",
    media_type: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    """
    Search the NASA Image & Video Library.
    Returns parsed dict with 'items' list and 'total_hits'.
    """
    cache_key = f"{query}_{media_type}_{page}_{page_size}"
    now = time.time()
    
    # Return from cache if valid
    if cache_key in MEDIA_CACHE:
        timestamp, cached_data = MEDIA_CACHE[cache_key]
        if now - timestamp < CACHE_TTL:
            return cached_data

    params = {
        "q": query,
        "page": page,
        "page_size": page_size,
    }
    if media_type and media_type in ("image", "video"):
        params["media_type"] = media_type

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                f"{NASA_IMAGES_API_URL}/search", params=params
            )
            resp.raise_for_status()
            data = resp.json()

            collection = data.get("collection", {})
            raw_items = collection.get("items", [])
            total_hits = collection.get("metadata", {}).get("total_hits", 0)

            items: List[dict] = []
            for item in raw_items:
                item_data = item.get("data", [{}])[0] if item.get("data") else {}
                links = item.get("links", [])
                thumbnail = ""
                for link in links:
                    if link.get("rel") == "preview":
                        thumbnail = link.get("href", "")
                        break

                nasa_id = item_data.get("nasa_id", "")
                m_type = item_data.get("media_type", "image")

                # For videos, construct preview URL (resolved on-demand when user clicks)
                video_url = None
                if m_type == "video" and nasa_id:
                    video_url = f"{NASA_IMAGES_API_URL}/asset/{nasa_id}"

                items.append({
                    "nasa_id": nasa_id,
                    "title": item_data.get("title", "Untitled"),
                    "description": (item_data.get("description") or "")[:300],
                    "media_type": m_type,
                    "thumbnail": thumbnail,
                    "video_url": video_url,
                    "date_created": item_data.get("date_created", ""),
                    "center": item_data.get("center", ""),
                })

        result = {"items": items, "total_hits": total_hits}
        MEDIA_CACHE[cache_key] = (now, result)
        return result

    except httpx.HTTPError as exc:
        print(f"[NASA Media] Error: {exc}")
        return {"items": [], "total_hits": 0}

from typing import Optional


async def resolve_video_url(nasa_id: str) -> Optional[str]:
    """Resolve the actual mp4 URL for a video by its NASA ID."""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(f"{NASA_IMAGES_API_URL}/asset/{nasa_id}")
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("collection", {}).get("items", [])
                for item in items:
                    href = item.get("href", "")
                    if href.endswith(".mp4") and "~orig" in href:
                        return href
                for item in items:
                    href = item.get("href", "")
                    if href.endswith(".mp4"):
                        return href
    except Exception:
        pass
    return None
