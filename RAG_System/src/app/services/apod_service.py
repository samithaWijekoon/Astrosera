"""Service for fetching NASA Astronomy Picture of the Day (APOD).

Calls the NASA APOD API and returns today's picture data.
"""

import httpx

from ..core.config import get_settings

NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"


async def fetch_apod() -> dict:
    """Fetch today's Astronomy Picture of the Day from NASA.

    Returns:
        Dictionary with APOD data including title, explanation,
        image URL, date, media_type, and copyright.

    Raises:
        httpx.HTTPStatusError: If the NASA API returns an error status.
    """
    settings = get_settings()

    params = {
        "api_key": settings.nasa_api_key,
        "thumbs": True,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(NASA_APOD_URL, params=params)
        response.raise_for_status()
        return response.json()
