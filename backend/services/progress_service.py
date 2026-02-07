"""
Progress Service
Handles user progress tracking and persistence
"""

from datetime import datetime
from typing import Dict, List, Optional


class ProgressService:
    """Service for managing user learning progress"""
    
    def __init__(self):
        """Initialize progress service with in-memory storage"""
        # In production, this would use a database
        self.progress_store: Dict[str, Dict] = {}
    
    def get_user_progress(self, user_id: str) -> Dict:
        """
        Get progress for a specific user
        
        Args:
            user_id: User identifier
        
        Returns:
            User progress dictionary
        """
        if user_id not in self.progress_store:
            return self._create_default_progress()
        
        return self.progress_store[user_id]
    
    def mark_lesson_complete(self, user_id: str, lesson_id: str) -> Dict:
        """
        Mark a lesson as complete for a user
        
        Args:
            user_id: User identifier
            lesson_id: Lesson identifier
        
        Returns:
            Updated progress dictionary
        """
        # Initialize if user doesn't exist
        if user_id not in self.progress_store:
            self.progress_store[user_id] = self._create_default_progress()
        
        progress = self.progress_store[user_id]
        
        # Add lesson to completed list if not already there
        if lesson_id not in progress["completed_lessons"]:
            progress["completed_lessons"].append(lesson_id)
        
        # Update metadata
        progress["last_accessed_lesson"] = lesson_id
        progress["last_updated"] = datetime.utcnow().isoformat()
        
        return progress
    
    def update_last_accessed(self, user_id: str, lesson_id: str) -> Dict:
        """
        Update the last accessed lesson for a user
        
        Args:
            user_id: User identifier
            lesson_id: Lesson identifier
        
        Returns:
            Updated progress dictionary
        """
        if user_id not in self.progress_store:
            self.progress_store[user_id] = self._create_default_progress()
        
        progress = self.progress_store[user_id]
        progress["last_accessed_lesson"] = lesson_id
        progress["last_updated"] = datetime.utcnow().isoformat()
        
        return progress
    
    def get_completion_percentage(self, user_id: str, total_lessons: int = 3) -> int:
        """
        Calculate completion percentage for a user
        
        Args:
            user_id: User identifier
            total_lessons: Total number of available lessons
        
        Returns:
            Completion percentage (0-100)
        """
        progress = self.get_user_progress(user_id)
        completed = len(progress["completed_lessons"])
        
        if total_lessons == 0:
            return 0
        
        return int((completed / total_lessons) * 100)
    
    def is_lesson_complete(self, user_id: str, lesson_id: str) -> bool:
        """
        Check if a specific lesson is complete
        
        Args:
            user_id: User identifier
            lesson_id: Lesson identifier
        
        Returns:
            True if lesson is complete, False otherwise
        """
        progress = self.get_user_progress(user_id)
        return lesson_id in progress["completed_lessons"]
    
    def reset_progress(self, user_id: str) -> Dict:
        """
        Reset all progress for a user
        
        Args:
            user_id: User identifier
        
        Returns:
            New default progress dictionary
        """
        self.progress_store[user_id] = self._create_default_progress()
        return self.progress_store[user_id]
    
    def _create_default_progress(self) -> Dict:
        """
        Create a default progress structure
        
        Returns:
            Default progress dictionary
        """
        return {
            "completed_lessons": [],
            "last_accessed_lesson": None,
            "started_date": datetime.utcnow().isoformat(),
            "last_updated": datetime.utcnow().isoformat()
        }




