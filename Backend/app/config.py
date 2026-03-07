import os
from dotenv import load_dotenv

load_dotenv()

NASA_API_KEY: str = os.getenv("NASA_API_KEY", "DEMO_KEY")
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./content.db")

# NASA API endpoints
NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"
NASA_IMAGES_API_URL = "https://images-api.nasa.gov"

# NASA RSS / Blog feeds to scrape
NASA_RSS_FEEDS = [
    "https://www.nasa.gov/news-release/feed/",
    "https://www.nasa.gov/technology/feed/",
    "https://www.nasa.gov/earth/feed/",
    "https://www.nasa.gov/solar-system/feed/",
    "https://www.nasa.gov/universe/feed/",
    "https://www.nasa.gov/aeronautics/feed/",
    "https://www.nasa.gov/learning-resources/feed/",
    "https://www.nasa.gov/general/feed/",
]

# Cache durations in seconds
APOD_CACHE_DURATION = 3600 * 6   # 6 hours
NEWS_CACHE_DURATION = 3600       # 1 hour
