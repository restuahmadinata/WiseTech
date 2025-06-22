"""
Pydantic schemas for user-related API operations.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema with common attributes."""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    profile_photo: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user creation (registration)."""
    email: EmailStr
    username: str
    password: str


class UserUpdate(UserBase):
    """Schema for user profile updates."""
    password: Optional[str] = None


class UserAdminUpdate(UserBase):
    """Schema for admin user updates."""
    password: Optional[str] = None
    is_admin: Optional[bool] = None


class UserInDBBase(UserBase):
    """Base schema for user in database."""
    id: int
    joined_date: datetime
    is_admin: bool = False
    
    class Config:
        from_attributes = True


class User(UserInDBBase):
    """Schema for user response."""
    pass


class UserInDB(UserInDBBase):
    """Schema for user in database with hashed password."""
    hashed_password: str


class Token(BaseModel):
    """Schema for access token."""
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    """Schema for token payload."""
    sub: Optional[int] = None
