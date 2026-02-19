"""NASA APOD API client — fetches the Astronomy Picture of the Day."""

import httpx

from app.config import NASA_API_KEY, NASA_APOD_URL


async def fetch_apod_from_nasa(date: str | None = None) -> dict | None:
    """
    Fetch APOD data from NASA API.
    Returns raw JSON dict or None on failure.
    """
    params = {"api_key": NASA_API_KEY}
    if date:
        params["date"] = date

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(NASA_APOD_URL, params=params)
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPError as exc:
        print(f"[APOD] Error fetching from NASA: {exc}")
        return None
