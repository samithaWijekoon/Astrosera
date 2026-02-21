"""Web scraper for NASA blogs and RSS feeds using feedparser + BeautifulSoup."""

import re
import math
from datetime import datetime
from typing import List

import feedparser
import httpx
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from app.config import NASA_RSS_FEEDS
from app.models import Article, ScrapeMeta


CATEGORY_KEYWORDS = {
    "missions": [
        "artemis", "mission", "launch", "crew", "astronaut", "iss",
        "station", "rocket", "starship", "spacecraft", "orbit",
    ],
    "discoveries": [
        "discover", "found", "detect", "webb", "hubble", "telescope",
        "galaxy", "exoplanet", "dark matter", "black hole", "observation",
    ],
    "spaceweather": [
        "solar", "flare", "sun", "coronal", "aurora", "geomagnetic",
        "radiation", "storm", "magnetosphere",
    ],
    "technology": [
        "technology", "ai", "robot", "satellite", "instrument", "sensor",
        "propulsion", "engine", "innovation", "commercial",
    ],
    "planets": [
        "mars", "jupiter", "saturn", "venus", "mercury", "neptune",
        "uranus", "planet", "moon", "europa", "titan", "asteroid",
    ],
}


def classify_category(text: str) -> str:
    """Assign a category based on keyword frequency in the text."""
    text_lower = text.lower()
    scores = {}
    for cat, keywords in CATEGORY_KEYWORDS.items():
        scores[cat] = sum(1 for kw in keywords if kw in text_lower)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "missions"


def calc_reading_time(text: str) -> int:
    words = len(text.split())
    return max(1, math.ceil(words / 200))


def clean_html(html: str) -> str:
    """Strip HTML tags and return plain text."""
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text(separator=" ", strip=True)


def extract_image_from_html(html: str) -> str | None:
    """Try to extract the first <img> src from HTML content."""
    soup = BeautifulSoup(html, "html.parser")
    img = soup.find("img")
    if img and img.get("src"):
        return img["src"]
    return None
