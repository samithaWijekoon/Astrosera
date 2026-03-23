"""Service for fetching NASA EPIC (Earth Polychromatic Imaging Camera) imagery.

Calls the NASA EPIC API to get the most recent natural color Earth images.
"""

import httpx

from ..core.config import get_settings

NASA_EPIC_API_URL = "https://api.nasa.gov/EPIC/api/natural/images"
NASA_EPIC_ARCHIVE_URL = "https://api.nasa.gov/EPIC/archive/natural"


async def fetch_latest_epic_image() -> dict:
    """Fetch the most recent EPIC Earth image from NASA.

    Returns:
        Dictionary with EPIC data including caption, constructed image URL, 
        date, and identifier.

    Raises:
        httpx.HTTPStatusError: If the NASA API returns an error status.
        ValueError: If no images are returned by the API.
    """
    settings = get_settings()

    params = {
        "api_key": settings.nasa_api_key,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(NASA_EPIC_API_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        if not data:
            raise ValueError("No EPIC images found.")
            
        # Get the first (most recent) image from the current batch
        image_data = data[0]
        
        # Construct the archive URL for the image
        # Date format in JSON is "YYYY-MM-DD HH:MM:SS"
        date_str = image_data["date"].split(" ")[0]
        year, month, day = date_str.split("-")
        image_name = image_data["image"]
        
        image_url = f"{NASA_EPIC_ARCHIVE_URL}/{year}/{month}/{day}/png/{image_name}.png?api_key={settings.nasa_api_key}"
        
        return {
            "caption": image_data.get("caption", "Earth Polychromatic Imaging Camera"),
            "url": image_url,
            "date": image_data["date"],
            "identifier": image_data["identifier"]
        }
