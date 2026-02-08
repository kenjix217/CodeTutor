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
    api_key_vault = Column(String, nullable=True) # Encrypted AI Key
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    progress = relationship("Progress", back_populates="owner")
    arcade_stats = relationship("ArcadeStats", back_populates="owner")

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
