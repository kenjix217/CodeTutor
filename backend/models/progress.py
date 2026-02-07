"""
Progress Model
Data model for user learning progress
"""

from datetime import datetime
from typing import List, Optional


class Progress:
    """Learning progress data model"""
    
    def __init__(
        self,
        user_id: str,
        completed_lessons: Optional[List[str]] = None,
        last_accessed_lesson: Optional[str] = None,
        started_date: Optional[datetime] = None,
        last_updated: Optional[datetime] = None
    ):
        """
        Initialize progress
        
        Args:
            user_id: User identifier
            completed_lessons: List of completed lesson IDs
            last_accessed_lesson: ID of last accessed lesson
            started_date: When user started learning
            last_updated: Last update timestamp
        """
        self.user_id = user_id
        self.completed_lessons = completed_lessons or []
        self.last_accessed_lesson = last_accessed_lesson
        self.started_date = started_date or datetime.utcnow()
        self.last_updated = last_updated or datetime.utcnow()
    
    def mark_complete(self, lesson_id: str) -> None:
        """
        Mark a lesson as complete
        
        Args:
            lesson_id: Lesson identifier
        """
        if lesson_id not in self.completed_lessons:
            self.completed_lessons.append(lesson_id)
        self.last_accessed_lesson = lesson_id
        self.last_updated = datetime.utcnow()
    
    def is_complete(self, lesson_id: str) -> bool:
        """
        Check if a lesson is complete
        
        Args:
            lesson_id: Lesson identifier
        
        Returns:
            True if complete, False otherwise
        """
        return lesson_id in self.completed_lessons
    
    def get_completion_percentage(self, total_lessons: int) -> int:
        """
        Calculate completion percentage
        
        Args:
            total_lessons: Total number of lessons
        
        Returns:
            Percentage (0-100)
        """
        if total_lessons == 0:
            return 0
        return int((len(self.completed_lessons) / total_lessons) * 100)
    
    def to_dict(self) -> dict:
        """
        Convert progress to dictionary
        
        Returns:
            Progress data as dictionary
        """
        return {
            "user_id": self.user_id,
            "completed_lessons": self.completed_lessons,
            "last_accessed_lesson": self.last_accessed_lesson,
            "started_date": self.started_date.isoformat(),
            "last_updated": self.last_updated.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Progress":
        """
        Create progress from dictionary
        
        Args:
            data: Progress data dictionary
        
        Returns:
            Progress instance
        """
        return cls(
            user_id=data["user_id"],
            completed_lessons=data.get("completed_lessons", []),
            last_accessed_lesson=data.get("last_accessed_lesson"),
            started_date=datetime.fromisoformat(data["started_date"]) if "started_date" in data else None,
            last_updated=datetime.fromisoformat(data["last_updated"]) if "last_updated" in data else None
        )




