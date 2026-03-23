import smtplib
import os
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def generate_otp() -> str:
    """
    Generate a random 6-digit numeric string padding with zeroes.
    """
    return f"{random.randint(0, 999999):06d}"

def send_otp_email(receiver_email: str, otp_code: str):
    """
    Send an HTML verification email with the given OTP code using Gmail SMTP.
    """
    sender_email = os.getenv("SMTP_EMAIL")
    sender_password = os.getenv("SMTP_PASSWORD")

    if not sender_email or not sender_password:
        raise ValueError("SMTP_EMAIL and SMTP_PASSWORD must be defined in your .env file.")

    # Set up the email container class
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Your Verification Code"
    msg['From'] = sender_email
    msg['To'] = receiver_email

    # Professional looking HTML template
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5; text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Account Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering! Please use the following 6-digit One-Time Password (OTP) to complete your account verification.</p>
        
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">{otp_code}</span>
        </div>
        
        <p>This code is valid for 10 minutes. If you did not request this verification, please safely ignore this email.</p>
        <br>
        <p>Best regards,<br><strong>Your App Team</strong></p>
      </body>
    </html>
    """

    # Attach the HTML payload
    part = MIMEText(html_content, 'html')
    msg.attach(part)

    try:
        # Connect to Gmail's SMTP server on Port 587 (TLS context)
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_password)
        
        # Dispatch the email
        server.sendmail(sender_email, receiver_email, msg.as_string())
    except Exception as e:
        print(f"Failed to send email: {{e}}")
        raise e
    finally:
        server.quit()
