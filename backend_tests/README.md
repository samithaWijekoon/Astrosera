# FastAPI Backend Testing Setup

This directory contains the unit tests for the Python FastAPI backend, including simulated endpoints to provide proof of unit testing for your university project.

## Overview
The tests are written using `pytest` and `fastapi.testclient.TestClient`. 

All database calls to MongoDB and external API calls (such as Sending OTP Emails, OpenAI, and Pinecone) are completely mock-simulated using `unittest.mock.patch` and `unittest.mock.AsyncMock`. This ensures no data is written to the production database and no real emails are sent during development and CI/CD runs.

### Test Files Added
1. **`conftest.py`**: A configuration file used by `pytest`. Contains common fixtures such as our `mock_db_collection`, `mock_email_sender`, `auth_test_client`, and `rag_test_client`.
2. **`test_auth.py`**: Tests the Auth routes, checking correct response codes and format for `/register`, `/verify-otp`, and `/login`. It asserts that the mock DB and email methods were called with the correct parameters.
3. **`test_rag.py`**: Tests the `/qa` endpoint by mocking the multi-agent question-answering workflow to not rely on real LLM dependencies.
4. **`test_quiz.py`**: Because the FastAPI Quiz routes were not yet implemented inside Python (only in Node.js), this file contains a **dummy router** showing exactly how fetching and submitting queries will be validated in a unit test suite.

## How to Run Tests and Generate Coverage

To generate a coverage report for the Python backend, we can use `pytest-cov`. Make sure your virtual environment (e.g. from `RAG_System/venv`) is active.

### 1. Install Dependencies
Run the following command to make sure you have the testing tools and `httpx` (required by `TestClient`) installed:
```bash
pip install pytest pytest-cov pytest-asyncio httpx
```

### 2. Run the Tests with Coverage
To see the results in your terminal including missing coverage lines, run:
```bash
python -m pytest backend_tests/ --cov=python_otp_service --cov=RAG_System.src.app.api --cov-report=term-missing
```

### 3. Generate HTML Coverage Report (Optional)
If your university requires a visual report or an HTML document for the documentation portfolio:
```bash
python -m pytest backend_tests/ --cov=python_otp_service --cov=RAG_System.src.app.api --cov-report=html
```
*This will create an `htmlcov/` folder. Open `htmlcov/index.html` in your web browser to view the generated dashboard.*
