"""
User Model
Data model for user information (placeholder for future use)
"""

from datetime import datetime
from typing import Optional


class User:
    """User data model"""
    
    def __init__(
        self,
        user_id: str,
        username: Optional[str] = None,
        email: Optional[str] = None,
        created_at: Optional[datetime] = None
    ):
        """
        Initialize user
        
        Args:
            user_id: Unique user identifier
            username: Optional username
            email: Optional email address
            created_at: Account creation timestamp
        """
        self.user_id = user_id
        self.username = username
        self.email = email
        self.created_at = created_at or datetime.utcnow()
    
    def to_dict(self) -> dict:
        """
        Convert user to dictionary
        
        Returns:
            User data as dictionary
        """
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "User":
        """
        Create user from dictionary
        
        Args:
            data: User data dictionary
        
        Returns:
            User instance
        """
        return cls(
            user_id=data["user_id"],
            username=data.get("username"),
            email=data.get("email"),
            created_at=datetime.fromisoformat(data["created_at"]) if "created_at" in data else None
        )




