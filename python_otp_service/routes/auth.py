from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient

# Import models and utils from our python service
# In a real project with a standard structure, this might be absolute imports (e.g., from app.models import UserSchema)
from ..models import UserSchema
from ..utils import generate_otp, send_otp_email

router = APIRouter(prefix="/auth", tags=["Auth"])

# Simulate database connection (in production, use Dependency Injection)
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["astrosera_db"]
collection = db["users"]

# Request DTOs
class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserSchema):
    """
    Registers a new user, generates an OTP, and sends a verification email.
    """
    # 1. Check if user already exists
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash password in a real app (simplified here)
    user_data = user.model_dump()
    
    # 3. Generate a 6-digit OTP
    otp_code = generate_otp()
    
    # 4. Save to MongoDB with OTP details
    user_data["otp_code"] = otp_code
    user_data["is_verified"] = False
    
    await collection.insert_one(user_data)
    
    # 5. Call send_otp_email() to send it to the user
    try:
        # Note: smtplib is synchronous and can block the async event loop.
        # In production, use FastAPI BackgroundTasks or a task queue like Celery.
        send_otp_email(receiver_email=user.email, otp_code=otp_code)
    except Exception as e:
        # Optional: Handle email sending errors gracefully
        print(f"Error sending email: {e}")

    # Return message without the JWT token yet
    return {"message": "User registered. Please verify OTP."}


@router.post("/verify-otp", status_code=status.HTTP_200_OK)
async def verify_otp(request: VerifyOTPRequest):
    """
    Verifies the OTP provided by the user. If valid, marks the user as verified.
    """
    # 1. Check the database
    user = await collection.find_one({"email": request.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.get("is_verified"):
        return {"message": "User is already verified"}
    
    # 2. If OTP matches, update is_verified and clear otp_code
    if user.get("otp_code") == request.otp_code:
        await collection.update_one(
            {"email": request.email},
            {"$set": {"is_verified": True, "otp_code": None}}
        )
        return {"message": "OTP verified successfully. You can now login."}
    else:
        # OTP did not match
        raise HTTPException(status_code=400, detail="Invalid OTP code.")


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(request: LoginRequest):
    """
    Logs in the user and generates a JWT token, ensuring their email is verified.
    """
    # 1. Find user in the database
    user = await collection.find_one({"email": request.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Check password match (should use hashed comparison in production)
    if user.get("password") != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # 2. Before generating JWT token, check if the user is verified
    if not user.get("is_verified", False):
        # Raise HTTP 403 error: "Email not verified."
        raise HTTPException(status_code=403, detail="Email not verified.")
        
    # 3. Generate JWT Token (Placeholder)
    # token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": "dummy_jwt_token_12345", 
        "token_type": "bearer"
    }
