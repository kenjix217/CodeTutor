"""
Lesson Service
Handles lesson content loading and management
"""

from pathlib import Path
from typing import List, Dict, Optional


class LessonService:
    """Service for managing lesson content"""
    
    def __init__(self, lessons_directory: str = "../frontend/lessons"):
        """
        Initialize lesson service
        
        Args:
            lessons_directory: Path to directory containing lesson markdown files
        """
        self.lessons_dir = Path(lessons_directory)
        self.lessons_cache = {}
    
    def get_lesson_metadata(self) -> List[Dict[str, any]]:
        """
        Get metadata for all available lessons
        
        Returns:
            List of lesson metadata dictionaries
        """
        return [
            {
                "id": "lesson-01",
                "number": 1,
                "title": "What is Programming?",
                "description": "Understand what programming is and why Python is a great first language to learn.",
                "available": True
            },
            {
                "id": "lesson-02",
                "number": 2,
                "title": "Variables and Data Types",
                "description": "Learn how to store and work with different types of data in Python.",
                "available": True
            },
            {
                "id": "lesson-03",
                "number": 3,
                "title": "Input and Output",
                "description": "Discover how to get information from users and display results.",
                "available": True
            }
        ]
    
    def load_lesson(self, lesson_id: str) -> Optional[str]:
        """
        Load lesson content from markdown file
        
        Args:
            lesson_id: Lesson identifier (e.g., 'lesson-01')
        
        Returns:
            Lesson content as markdown string, or None if not found
        """
        # Check cache first
        if lesson_id in self.lessons_cache:
            return self.lessons_cache[lesson_id]
        
        # Load from file
        lesson_file = self.lessons_dir / f"{lesson_id}.md"
        
        if not lesson_file.exists():
            return None
        
        try:
            with open(lesson_file, 'r', encoding='utf-8') as f:
                content = f.read()
                self.lessons_cache[lesson_id] = content
                return content
        except Exception as e:
            print(f"Error loading lesson {lesson_id}: {e}")
            return None
    
    def get_lesson_by_number(self, number: int) -> Optional[Dict[str, any]]:
        """
        Get lesson metadata by lesson number
        
        Args:
            number: Lesson number (1-based)
        
        Returns:
            Lesson metadata or None if not found
        """
        lessons = self.get_lesson_metadata()
        for lesson in lessons:
            if lesson["number"] == number:
                return lesson
        return None
    
    def get_next_lesson(self, current_lesson_id: str) -> Optional[Dict[str, any]]:
        """
        Get the next lesson in sequence
        
        Args:
            current_lesson_id: Current lesson ID
        
        Returns:
            Next lesson metadata or None if this is the last lesson
        """
        lessons = self.get_lesson_metadata()
        
        # Find current lesson
        current_index = None
        for i, lesson in enumerate(lessons):
            if lesson["id"] == current_lesson_id:
                current_index = i
                break
        
        # Return next lesson if exists
        if current_index is not None and current_index + 1 < len(lessons):
            return lessons[current_index + 1]
        
        return None




