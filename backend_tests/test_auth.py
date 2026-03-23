import pytest
from fastapi.testclient import TestClient

def test_register_success(auth_test_client, mock_db_collection, mock_email_sender):
    # Setup mock behavior
    mock_db_collection.find_one.return_value = None  # Email not registered

    # Perform request
    response = auth_test_client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "securepassword", "username": "Test User"}
    )

    # Asserts
    assert response.status_code == 201
    assert response.json() == {"message": "User registered. Please verify OTP."}
    
    # Assert DB was called to insert
    mock_db_collection.insert_one.assert_called_once()
    inserted_user = mock_db_collection.insert_one.call_args[0][0]
    assert inserted_user["email"] == "test@example.com"
    assert "otp_code" in inserted_user
    assert inserted_user["is_verified"] is False

    # Assert Email was sent
    mock_email_sender.assert_called_once_with(
        receiver_email="test@example.com", 
        otp_code=inserted_user["otp_code"]
    )

def test_register_duplicate_email(auth_test_client, mock_db_collection):
    # Setup mock behavior
    mock_db_collection.find_one.return_value = {"email": "test@example.com"}

    # Perform request
    response = auth_test_client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "securepassword", "username": "Test User"}
    )

    # Asserts
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"
    mock_db_collection.insert_one.assert_not_called()

def test_verify_otp_success(auth_test_client, mock_db_collection):
    # Setup mock behavior
    mock_db_collection.find_one.return_value = {
        "email": "test@example.com",
        "is_verified": False,
        "otp_code": "123456"
    }

    # Perform request
    response = auth_test_client.post(
        "/auth/verify-otp",
        json={"email": "test@example.com", "otp_code": "123456"}
    )

    # Asserts
    assert response.status_code == 200
    assert response.json() == {"message": "OTP verified successfully. You can now login."}
    
    # Check update_one was called correctly
    mock_db_collection.update_one.assert_called_once()
    update_args = mock_db_collection.update_one.call_args[0]
    assert update_args[0] == {"email": "test@example.com"}
    assert update_args[1] == {"$set": {"is_verified": True, "otp_code": None}}

def test_verify_otp_invalid_code(auth_test_client, mock_db_collection):
    # Setup mock behavior
    mock_db_collection.find_one.return_value = {
        "email": "test@example.com",
        "is_verified": False,
        "otp_code": "123456"
    }

    # Perform request
    response = auth_test_client.post(
        "/auth/verify-otp",
        json={"email": "test@example.com", "otp_code": "000000"}  # Wrong code
    )

    # Asserts
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid OTP code."

def test_login_success(auth_test_client, mock_db_collection):
    # Setup mock behavior
    mock_db_collection.find_one.return_value = {
        "email": "test@example.com",
        "password": "securepassword",
        "is_verified": True
    }

    # Perform request
    response = auth_test_client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "securepassword"}
    )

    # Asserts
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_password(auth_test_client, mock_db_collection):
    # Setup mock behavior
    mock_db_collection.find_one.return_value = {
        "email": "test@example.com",
        "password": "securepassword",
        "is_verified": True
    }

    # Perform request
    response = auth_test_client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"}
    )

    # Asserts
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"

def test_login_unverified_email(auth_test_client, mock_db_collection):
    # Setup mock behavior
    mock_db_collection.find_one.return_value = {
        "email": "test@example.com",
        "password": "securepassword",
        "is_verified": False  # Not verified!
    }

    # Perform request
    response = auth_test_client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "securepassword"}
    )

    # Asserts
    assert response.status_code == 403
    assert response.json()["detail"] == "Email not verified."
