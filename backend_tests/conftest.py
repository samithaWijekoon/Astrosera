import sys
import os
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import FastAPI
from fastapi.testclient import TestClient

# Add project root to path so we can import the services
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import the router from python_otp_service
from python_otp_service.routes.auth import router as auth_router

# Import the RAG app
from RAG_System.src.app.api import app as rag_app

@pytest.fixture
def auth_test_client():
    """
    Creates a FastAPI test client with the auth router included.
    We create a dummy app here since python_otp_service doesn't have a main.py
    """
    app = FastAPI()
    app.include_router(auth_router)
    return TestClient(app)

@pytest.fixture
def rag_test_client():
    """
    Creates a FastAPI test client for the RAG system api.
    """
    return TestClient(rag_app, raise_server_exceptions=False)

@pytest.fixture
def mock_db_collection():
    """
    Mocks the motor async MongoDB collection used in the auth service.
    """
    with patch('python_otp_service.routes.auth.collection') as mock_coll:
        # Give the mock basic async methods used in the router
        mock_coll.find_one = AsyncMock()
        mock_coll.insert_one = AsyncMock()
        mock_coll.update_one = AsyncMock()
        yield mock_coll

@pytest.fixture
def mock_email_sender():
    """
    Mocks the send_otp_email function so no real emails are sent during tests.
    """
    with patch('python_otp_service.routes.auth.send_otp_email') as mock_send:
        yield mock_send

@pytest.fixture
def mock_rag_qa_service():
    """
    Mocks the RAG question answering service to avoid calling actual LLMs (OpenAI) or Vector DBs (Pinecone).
    """
    with patch('RAG_System.src.app.api.answer_question') as mock_qa:
        def side_effect(question):
            approved_questions = [
                "What is the Artemis mission?",
                "What has the Curiosity rover found on Mars?",
                "What is the Big Bang?",
                "How does NASA use supercomputers?"
            ]
            if question in approved_questions:
                return {
                    "answer": f"Mocked answer for: {question}",
                    "context": "Mocked context from vector database.",
                    "citations": {}
                }
            return {
                "answer": "This is a default mocked RAG answer.",
                "context": "This is mocked context from the vector database.",
                "citations": {}
            }
        
        mock_qa.side_effect = side_effect
        yield mock_qa
