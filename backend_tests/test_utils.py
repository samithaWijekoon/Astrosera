import pytest
import os
import smtplib
from unittest.mock import patch, MagicMock
from python_otp_service.utils import generate_otp, send_otp_email

def test_generate_otp():
    otp = generate_otp()
    assert len(otp) == 6
    assert otp.isdigit()

@patch.dict(os.environ, {}, clear=True)
def test_send_otp_email_missing_env():
    with pytest.raises(ValueError, match="SMTP_EMAIL and SMTP_PASSWORD must be defined"):
        send_otp_email("test@example.com", "123456")

@patch.dict(os.environ, {"SMTP_EMAIL": "sender@example.com", "SMTP_PASSWORD": "password123"})
@patch('python_otp_service.utils.smtplib.SMTP')
def test_send_otp_email_success(mock_smtp_class):
    # Setup the mock server instance
    mock_server = MagicMock()
    mock_smtp_class.return_value = mock_server
    
    send_otp_email("test@example.com", "123456")
    
    # Verify SMTP behaviors
    mock_smtp_class.assert_called_once_with('smtp.gmail.com', 587)
    mock_server.starttls.assert_called_once()
    mock_server.login.assert_called_once_with("sender@example.com", "password123")
    mock_server.sendmail.assert_called_once()
    mock_server.quit.assert_called_once()

@patch.dict(os.environ, {"SMTP_EMAIL": "sender@example.com", "SMTP_PASSWORD": "password123"})
@patch('python_otp_service.utils.smtplib.SMTP')
def test_send_otp_email_smtplib_exception(mock_smtp_class):
    # Setup the mock server instance
    mock_server = MagicMock()
    mock_smtp_class.return_value = mock_server
    
    # Force an exception during login
    mock_server.login.side_effect = smtplib.SMTPException("SMTP Connection Failed")
    
    with pytest.raises(smtplib.SMTPException, match="SMTP Connection Failed"):
        send_otp_email("test@example.com", "123456")
    
    # Verify quit is still called in finally block
    mock_server.quit.assert_called_once()
