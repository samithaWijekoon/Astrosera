import pytest
from unittest.mock import patch, AsyncMock
from fastapi import UploadFile

@pytest.mark.parametrize("question", [
    "What is the Artemis mission?",
    "What has the Curiosity rover found on Mars?",
    "What is the Big Bang?",
    "How does NASA use supercomputers?"
])
def test_qa_endpoint_success(rag_test_client, mock_rag_qa_service, question):
    """
    Test that the RAG `/qa` endpoint accepts the approved questions and returns a QAResponse.
    """
    response = rag_test_client.post(
        "/qa",
        json={"question": question}
    )

    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "context" in data
    assert "citations" in data
    assert data["answer"] == f"Mocked answer for: {question}"
    mock_rag_qa_service.assert_called_with(question)

def test_qa_endpoint_empty_question(rag_test_client, mock_rag_qa_service):
    """
    Test that the RAG `/qa` endpoint strictly prevents empty questions.
    """
    response = rag_test_client.post(
        "/qa",
        json={"question": "   \n"}
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "`question` must be a non-empty string."
    mock_rag_qa_service.assert_not_called()

def test_qa_endpoint_openai_timeout(rag_test_client, mock_rag_qa_service):
    """
    Test that an OpenAI timeout exception is caught and returns HTTP 500 safely.
    """
    mock_rag_qa_service.side_effect = Exception("OpenAI Request Timeout")
    
    response = rag_test_client.post(
        "/qa",
        json={"question": "What is the Big Bang?"}
    )
    
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal server error"}

def test_qa_endpoint_pinecone_connection_error(rag_test_client, mock_rag_qa_service):
    """
    Test that a Pinecone connection error is caught and returns HTTP 500 safely.
    """
    mock_rag_qa_service.side_effect = Exception("Pinecone Vector DB Connection Refused")
    
    response = rag_test_client.post(
        "/qa",
        json={"question": "What is the Big Bang?"}
    )
    
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal server error"}

def test_qa_endpoint_general_exception(rag_test_client, mock_rag_qa_service):
    """
    Test that a general unexpected exception is caught and returns HTTP 500 safely.
    """
    mock_rag_qa_service.side_effect = Exception("Unknown System Failure")
    
    response = rag_test_client.post(
        "/qa",
        json={"question": "What is the Big Bang?"}
    )
    
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal server error"}

def test_health_check(rag_test_client):
    response = rag_test_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "RAG API is running"}

@patch('RAG_System.src.app.api.fetch_apod', new_callable=AsyncMock)
def test_get_apod_success(mock_fetch, rag_test_client):
    mock_fetch.return_value = {
        "title": "Astronomy Image",
        "explanation": "Test explanation.",
        "url": "http://nasa.gov/image.jpg",
        "media_type": "image",
    }
    
    response = rag_test_client.get("/apod")
    assert response.status_code == 200
    assert response.json()["title"] == "Astronomy Image"
    mock_fetch.assert_called_once()

@patch('RAG_System.src.app.api.fetch_apod', new_callable=AsyncMock)
def test_get_apod_failure(mock_fetch, rag_test_client):
    mock_fetch.side_effect = Exception("NASA API unavailable")
    
    response = rag_test_client.get("/apod")
    assert response.status_code == 502
    assert "Failed to fetch APOD" in response.json()["detail"]

@patch('RAG_System.src.app.api.fetch_latest_epic_image', new_callable=AsyncMock)
def test_get_epic_success(mock_fetch, rag_test_client):
    mock_fetch.return_value = {
        "caption": "Earth Image",
        "url": "http://nasa.gov/epic.jpg",
        "date": "2023-01-01",
        "identifier": "12345"
    }
    
    response = rag_test_client.get("/epic")
    assert response.status_code == 200
    assert response.json()["caption"] == "Earth Image"
    mock_fetch.assert_called_once()

@patch('RAG_System.src.app.api.fetch_latest_epic_image', new_callable=AsyncMock)
def test_get_epic_failure(mock_fetch, rag_test_client):
    mock_fetch.side_effect = Exception("Timeout")
    
    response = rag_test_client.get("/epic")
    assert response.status_code == 502
    assert "Failed to fetch EPIC image" in response.json()["detail"]

def test_index_pdf_invalid_type(rag_test_client):
    response = rag_test_client.post(
        "/index-pdf",
        files={"file": ("test.txt", b"text content", "text/plain")}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Only PDF files are supported."

@patch('RAG_System.src.app.api.index_pdf_file')
@patch('RAG_System.src.app.api.Path')
def test_index_pdf_success(mock_path, mock_index_file, rag_test_client):
    # Setup mock to avoid writing real files
    mock_index_file.return_value = 10  # Chunks indexed
    
    response = rag_test_client.post(
        "/index-pdf",
        files={"file": ("document.pdf", b"%PDF-1.4...", "application/pdf")}
    )
    
    assert response.status_code == 200
    assert response.json()["chunks_indexed"] == 10
    mock_index_file.assert_called_once()
