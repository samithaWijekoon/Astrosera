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


# ── Category classifier ──────────────────────────────────────────────
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


# ── Main scraper ─────────────────────────────────────────────────────

async def scrape_nasa_feeds(db: Session) -> int:
    """
    Scrape all configured NASA RSS feeds.
    Returns the number of new articles inserted.
    """
    new_count = 0

    for feed_url in NASA_RSS_FEEDS:
        try:
            # Fetch the feed XML
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.get(feed_url)
                resp.raise_for_status()
                feed_xml = resp.text

            parsed = feedparser.parse(feed_xml)

            for entry in parsed.entries:
                # Deduplicate by link
                link = entry.get("link", "")
                if not link:
                    continue

                existing = (
                    db.query(Article)
                    .filter(Article.url == link)
                    .first()
                )
                if existing:
                    continue

                # Extract fields
                title = entry.get("title", "Untitled")
                raw_summary = entry.get("summary", "")
                raw_content = ""
                if entry.get("content"):
                    raw_content = entry.content[0].get("value", "")

                plain_summary = clean_html(raw_summary)[:300]
                full_text = clean_html(raw_content) if raw_content else plain_summary

                # Publication date
                pub_date = ""
                if entry.get("published_parsed"):
                    try:
                        pub_date = datetime(*entry.published_parsed[:6]).strftime(
                            "%Y-%m-%d"
                        )
                    except Exception:
                        pub_date = datetime.utcnow().strftime("%Y-%m-%d")
                elif entry.get("published"):
                    pub_date = entry.published[:10]
                else:
                    pub_date = datetime.utcnow().strftime("%Y-%m-%d")

                # Image extraction
                image_url = None
                if entry.get("media_content"):
                    image_url = entry.media_content[0].get("url")
                if not image_url and entry.get("media_thumbnail"):
                    image_url = entry.media_thumbnail[0].get("url")
                if not image_url:
                    image_url = extract_image_from_html(raw_summary + raw_content)
                if not image_url:
                    # Fallback placeholder
                    image_url = f"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=400&fit=crop"

                source = parsed.feed.get("title", "NASA")
                category = classify_category(title + " " + plain_summary)
                reading_time = calc_reading_time(full_text)

                article = Article(
                    title=title,
                    summary=plain_summary if len(plain_summary) > 10 else title,
                    full_content=full_text,
                    source=source,
                    date=pub_date,
                    category=category,
                    image_url=image_url,
                    url=link,
                    reading_time=reading_time,
                    trending=False,
                )
                db.add(article)
                new_count += 1

            # Update scrape metadata
            meta = (
                db.query(ScrapeMeta)
                .filter(ScrapeMeta.feed_url == feed_url)
                .first()
            )
            if meta:
                meta.last_scraped_at = datetime.utcnow()
            else:
                db.add(ScrapeMeta(feed_url=feed_url, last_scraped_at=datetime.utcnow()))

        except Exception as exc:
            print(f"[Scraper] Error scraping {feed_url}: {exc}")
            continue

    if new_count > 0:
        db.commit()
        print(f"[Scraper] Inserted {new_count} new articles.")

        # Mark newest 3 as trending
        latest = (
            db.query(Article)
            .order_by(Article.date.desc())
            .limit(3)
            .all()
        )
        for a in latest:
            a.trending = True
        db.commit()

    return new_count
