from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class UserSchema(BaseModel):
    username: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    
    # New OTP and verification fields
    is_verified: bool = Field(default=False)
    otp_code: Optional[str] = Field(default=None)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "johndoe@example.com",
                "password": "StrongPassword123",
                "is_verified": False,
                "otp_code": "123456"
            }
        }
