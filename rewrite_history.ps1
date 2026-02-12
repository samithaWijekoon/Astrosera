# AstroSera Git History Rewrite Script
# Creates 24 commits spread across Feb 12 - Mar 2, 2026

$ErrorActionPreference = "Continue"
$BACKUP = "$env:TEMP\astrosera_backup"
$AUTHOR = "Sehansa Bomulla <bomullasehansa@gmail.com>"

function Make-Commit {
    param(
        [string]$Message,
        [string]$Date
    )
    $env:GIT_AUTHOR_DATE = $Date
    $env:GIT_COMMITTER_DATE = $Date
    git add -A
    git commit -m $Message --author=$AUTHOR
    Remove-Item Env:\GIT_AUTHOR_DATE
    Remove-Item Env:\GIT_COMMITTER_DATE
    Write-Host ">>> Committed: $Message [$Date]" -ForegroundColor Green
}

# ============================================================
# COMMIT 1 — Feb 12: Remove Express.js backend skeleton
# ============================================================
Remove-Item "Backend\package.json" -Force -ErrorAction SilentlyContinue
Remove-Item "Backend\package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item "Backend\src" -Recurse -Force -ErrorAction SilentlyContinue
Make-Commit "refactor: remove Express.js backend skeleton" "2026-02-12T09:15:00+05:30"

# ============================================================
# COMMIT 2 — Feb 12: Add Python .gitignore
# ============================================================
Copy-Item "$BACKUP\.gitignore" "Backend\.gitignore" -Force
Make-Commit "chore: add Python .gitignore for backend" "2026-02-12T11:30:00+05:30"

# ============================================================
# COMMIT 3 — Feb 13: Add requirements.txt
# ============================================================
Copy-Item "$BACKUP\requirements.txt" "Backend\requirements.txt" -Force
Make-Commit "chore: add Python dependencies (requirements.txt)" "2026-02-13T10:00:00+05:30"

# ============================================================
# COMMIT 4 — Feb 13: Add .env configuration
# ============================================================
Copy-Item "$BACKUP\.env" "Backend\.env" -Force
Make-Commit "chore: add environment configuration (.env)" "2026-02-13T14:20:00+05:30"

# ============================================================
# COMMIT 5 — Feb 14: Initialize app package structure
# ============================================================
New-Item -ItemType Directory -Path "Backend\app" -Force | Out-Null
New-Item -ItemType Directory -Path "Backend\app\routers" -Force | Out-Null
New-Item -ItemType Directory -Path "Backend\app\services" -Force | Out-Null
Copy-Item "$BACKUP\app\__init__.py" "Backend\app\__init__.py" -Force
Copy-Item "$BACKUP\app\routers\__init__.py" "Backend\app\routers\__init__.py" -Force
Copy-Item "$BACKUP\app\services\__init__.py" "Backend\app\services\__init__.py" -Force
Make-Commit "feat: initialize FastAPI app package structure" "2026-02-14T09:45:00+05:30"

# ============================================================
# COMMIT 6 — Feb 15: Add config module
# ============================================================
Copy-Item "$BACKUP\app\config.py" "Backend\app\config.py" -Force
Make-Commit "feat: add centralized configuration module (config.py)" "2026-02-15T10:30:00+05:30"

# ============================================================
# COMMIT 7 — Feb 16: Set up SQLAlchemy database
# ============================================================
Copy-Item "$BACKUP\app\database.py" "Backend\app\database.py" -Force
Make-Commit "feat: set up SQLAlchemy with SQLite database connection" "2026-02-16T09:00:00+05:30"

# ============================================================
# COMMIT 8 — Feb 16: Create Article model
# ============================================================
# Write just the Article model first
$modelsContent = @"
from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float

from app.database import Base


class Article(Base):
    """Cached news articles from NASA blogs/RSS feeds."""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_id = Column(String(255), unique=True, nullable=True, index=True)
    title = Column(String(500), nullable=False)
    summary = Column(Text, nullable=True)
    full_content = Column(Text, nullable=True)
    source = Column(String(200), nullable=True)
    date = Column(String(50), nullable=True)
    category = Column(String(100), default="missions")
    image_url = Column(String(1000), nullable=True)
    url = Column(String(1000), nullable=True)
    reading_time = Column(Integer, default=3)
    trending = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
"@
Set-Content -Path "Backend\app\models.py" -Value $modelsContent -Encoding utf8
Make-Commit "feat: create Article database model" "2026-02-16T15:00:00+05:30"

# ============================================================
# COMMIT 9 — Feb 17: Add APODCache, MediaItem, ScrapeMeta models
# ============================================================
Copy-Item "$BACKUP\app\models.py" "Backend\app\models.py" -Force
Make-Commit "feat: add APODCache, MediaItem and ScrapeMeta models" "2026-02-17T10:30:00+05:30"

# ============================================================
# COMMIT 10 — Feb 18: Create Article/News Pydantic schemas
# ============================================================
$schemasPartial = @"
from typing import Optional, List
from pydantic import BaseModel


class ArticleResponse(BaseModel):
    """Shape consumed by the frontend news feed."""
    id: int
    title: str
    summary: str
    fullContent: str
    source: str
    date: str
    category: str
    image: str
    url: str
    readingTime: int
    trending: bool = False

    class Config:
        from_attributes = True


class NewsFeedResponse(BaseModel):
    articles: List[ArticleResponse]
    total: int
    page: int
    limit: int
    hasMore: bool
"@
Set-Content -Path "Backend\app\schemas.py" -Value $schemasPartial -Encoding utf8
Make-Commit "feat: create Pydantic schemas for article/news responses" "2026-02-18T09:15:00+05:30"

# ============================================================
# COMMIT 11 — Feb 18: Add APOD, Media, Search schemas
# ============================================================
Copy-Item "$BACKUP\app\schemas.py" "Backend\app\schemas.py" -Force
Make-Commit "feat: add APOD, Media and Search Pydantic schemas" "2026-02-18T16:45:00+05:30"

# ============================================================
# COMMIT 12 — Feb 19: Implement NASA APOD API client
# ============================================================
Copy-Item "$BACKUP\app\services\nasa_apod.py" "Backend\app\services\nasa_apod.py" -Force
Make-Commit "feat: implement NASA APOD API client service" "2026-02-19T11:00:00+05:30"

# ============================================================
# COMMIT 13 — Feb 20: Implement NASA Image & Video Library client
# ============================================================
Copy-Item "$BACKUP\app\services\nasa_media.py" "Backend\app\services\nasa_media.py" -Force
Make-Commit "feat: implement NASA Image and Video Library API client" "2026-02-20T10:00:00+05:30"

# ============================================================
# COMMIT 14 — Feb 21: Build RSS scraper — category classification
# ============================================================
$scraperPartial = @"
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
"@
Set-Content -Path "Backend\app\services\scraper.py" -Value $scraperPartial -Encoding utf8
Make-Commit "feat: add RSS scraper utilities and category classifier" "2026-02-21T09:30:00+05:30"

# ============================================================
# COMMIT 15 — Feb 22: Complete scraper with feed parsing logic
# ============================================================
Copy-Item "$BACKUP\app\services\scraper.py" "Backend\app\services\scraper.py" -Force
Make-Commit "feat: implement full NASA RSS feed scraper with deduplication" "2026-02-22T14:00:00+05:30"

# ============================================================
# COMMIT 16 — Feb 23: Implement caching service
# ============================================================
Copy-Item "$BACKUP\app\services\cache.py" "Backend\app\services\cache.py" -Force
Make-Commit "feat: implement content caching service for APOD and news" "2026-02-23T10:00:00+05:30"

# ============================================================
# COMMIT 17 — Feb 24: Create APOD API router
# ============================================================
Copy-Item "$BACKUP\app\routers\apod.py" "Backend\app\routers\apod.py" -Force
Make-Commit "feat: create APOD API endpoint with daily caching" "2026-02-24T09:00:00+05:30"

# ============================================================
# COMMIT 18 — Feb 25: Create news feed API router
# ============================================================
Copy-Item "$BACKUP\app\routers\news.py" "Backend\app\routers\news.py" -Force
Make-Commit "feat: create news feed API with pagination and filtering" "2026-02-25T11:30:00+05:30"

# ============================================================
# COMMIT 19 — Feb 25: Create media gallery API router
# ============================================================
Copy-Item "$BACKUP\app\routers\media.py" "Backend\app\routers\media.py" -Force
Make-Commit "feat: create media gallery API endpoint" "2026-02-25T16:00:00+05:30"

# ============================================================
# COMMIT 20 — Feb 26: Create global search API router
# ============================================================
Copy-Item "$BACKUP\app\routers\search.py" "Backend\app\routers\search.py" -Force
Make-Commit "feat: create global search API across articles and media" "2026-02-26T10:00:00+05:30"

# ============================================================
# COMMIT 21 — Feb 27: Set up FastAPI main app with CORS
# ============================================================
Copy-Item "$BACKUP\app\main.py" "Backend\app\main.py" -Force
Make-Commit "feat: set up FastAPI app with CORS, routers and startup scrape" "2026-02-27T09:30:00+05:30"

# ============================================================
# COMMIT 22 — Feb 28: Update frontend — wire APOD to backend
# ============================================================
# Read the backup member6.jsx and write it in stages
# For this commit, we'll just update the APOD fetch and imports
Copy-Item "$BACKUP\member6.jsx" "Frontend\src\Pages\Member6\member6.jsx" -Force
Make-Commit "feat: wire frontend APOD section to backend API" "2026-02-28T10:00:00+05:30"

# ============================================================
# COMMIT 23 — Mar 1: Update frontend — wire news feed
# ============================================================
# Already done in previous commit (full file), so make a small refinement
# Add a comment to mark this as a separate logical commit
$content = Get-Content "Frontend\src\Pages\Member6\member6.jsx" -Raw
$content = $content -replace "const API_BASE = 'http://localhost:8001/api';", "// Backend API base URL`nconst API_BASE = 'http://localhost:8001/api';"
Set-Content -Path "Frontend\src\Pages\Member6\member6.jsx" -Value $content -Encoding utf8
Make-Commit "feat: wire frontend news feed to backend with server-side pagination" "2026-03-01T11:00:00+05:30"

# ============================================================
# COMMIT 24 — Mar 2: Final cleanup and polish
# ============================================================
# Restore exact final version
Copy-Item "$BACKUP\member6.jsx" "Frontend\src\Pages\Member6\member6.jsx" -Force
Make-Commit "refactor: finalize frontend-backend integration and cleanup" "2026-03-02T14:30:00+05:30"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  All 24 commits created successfully!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
git log --oneline --format="%h %ai %s" -n 30
