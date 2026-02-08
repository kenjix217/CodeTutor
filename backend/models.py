"""
SQLAlchemy Database Models
"""
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False) # Changed to Not Null
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    hashed_password = Column(String)
    
    # Extended Profile
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    title = Column(String, default="Novice Coder")
    avatar_url = Column(String, nullable=True)
    
    # Relationships
    progress = relationship("Progress", back_populates="owner")
    settings = relationship("Settings", back_populates="owner", uselist=False)
    arcade_stats = relationship("ArcadeStats", back_populates="owner")

class Settings(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # UI Preferences
    theme = Column(String, default="light") # light, dark
    editor_font_size = Column(Integer, default=14)
    
    # AI Preferences
    ai_enabled = Column(Boolean, default=True)
    ai_provider = Column(String, default="openrouter")
    ai_model = Column(String, default="thudm/glm-4-9b-chat:free")
    api_key_vault = Column(String, nullable=True) # Encrypted
    
    # Voice Preferences
    voice_enabled = Column(Boolean, default=True)
    voice_speed = Column(Float, default=1.0)
    
    owner = relationship("User", back_populates="settings")

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(String, index=True) # e.g. "lesson-01"
    status = Column(String) # "completed", "started"
    homework_passed = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="progress")

class ArcadeStats(Base):
    __tablename__ = "arcade_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mode = Column(String) # "bug_hunter", "code_golf"
    score = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="arcade_stats")
