import pytest

def test_qa_endpoint_success(rag_test_client, mock_rag_qa_service):
    """
    Test that the RAG `/qa` endpoint accepts a QuestionRequest and returns a QAResponse.
    The LLM agent workflow is mocked so no real OpenAI calls occur.
    """
    # Perform request
    response = rag_test_client.post(
        "/qa",
        json={"question": "What is a vector database?"}
    )

    # Asserts
    assert response.status_code == 200
    data = response.json()
    
    # Assert the response format is correctly structured
    assert "answer" in data
    assert "context" in data
    assert "citations" in data
    
    # Assert it contains the mocked values
    assert data["answer"] == "This is a mocked RAG answer."
    assert data["context"] == "This is mocked context from the vector database."
    
    # Check that our mock service was called with the correct argument
    mock_rag_qa_service.assert_called_once_with("What is a vector database?")

def test_qa_endpoint_empty_question(rag_test_client, mock_rag_qa_service):
    """
    Test that the RAG `/qa` endpoint strictly prevents empty questions.
    """
    # Perform request with empty question
    response = rag_test_client.post(
        "/qa",
        json={"question": "   \n"}
    )

    # Asserts
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "`question` must be a non-empty string."
    
    # Service should not be called
    mock_rag_qa_service.assert_not_called()
