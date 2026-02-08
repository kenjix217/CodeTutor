"""
Pydantic Schemas for API Validation
"""
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr # Required + Validates format
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    has_api_key: bool = False # Don't send the actual key back!

    class Config:
        from_attributes = True

# --- Progress Schemas ---
class ProgressBase(BaseModel):
    lesson_id: str
    status: str
    homework_passed: bool = False

class ProgressCreate(ProgressBase):
    pass

class ProgressResponse(ProgressBase):
    updated_at: datetime
    
    class Config:
        from_attributes = True

# --- API Key Vault Schema ---
class APIKeyUpdate(BaseModel):
    api_key: str # The key to encrypt and store

# --- Arcade Schemas ---
class ArcadeScoreBase(BaseModel):
    mode: str
    score: int

class ArcadeScoreCreate(ArcadeScoreBase):
    pass
