from typing import Optional, Dict
from pydantic import BaseModel

class QuestionRequest(BaseModel):
    """Request body for the `/qa` endpoint.

    The PRD specifies a single field named `question` that contains
    the user's natural language question about the NASA knowledge base.
    """
    question: str

class QAResponse(BaseModel):
    """Response body for the `/qa` endpoint.

    From the API consumer's perspective we only expose the final,
    verified answer plus some metadata (e.g. context snippets).
    Internal draft answers remain inside the agent pipeline.
    """
    answer: str
    context: str
    citations: Optional[Dict[str, Dict]] = None


class APODResponse(BaseModel):
    """Response body for the `/apod` endpoint.

    Mirrors the NASA APOD API response structure with only the
    fields we need for the chat interface card.
    """
    title: str
    explanation: str
    url: str
    hdurl: Optional[str] = None
    date: str
    media_type: str
    copyright: Optional[str] = None


class EPICResponse(BaseModel):
    """Response body for the `/epic` endpoint.

    Contains the most recent Earth image from the EPIC camera.
    """
    title: str = "NASA EPIC Earth Imagery"
    caption: str
    url: str
    date: str
    identifier: str
