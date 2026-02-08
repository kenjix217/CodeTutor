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
    dob: Optional[str] = None # YYYY-MM-DD
    xp: int = 0
    level: int = 1
    title: str = "Novice Coder"
    avatar_url: Optional[str] = None

class SettingsBase(BaseModel):
    theme: str = "light"
    editor_font_size: int = 14
    ai_enabled: bool = True
    ai_provider: str = "openrouter"
    ai_model: str = "thudm/glm-4-9b-chat:free"
    api_key_vault: Optional[str] = None
    voice_enabled: bool = True
    voice_speed: float = 1.0

class SettingsUpdate(SettingsBase):
    pass

class UserProfile(UserBase):
    id: int
    created_at: datetime
    settings: Optional[SettingsBase] = None
    
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
