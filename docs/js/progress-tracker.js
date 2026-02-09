/**
 * Progress Tracker Module
 * Handles learning progress tracking and persistence
 */

export class ProgressTracker {
  constructor() {
    this.storageKey = 'python-tutor-progress';
    this.progress = this.loadProgress();
  }

  /**
   * Load progress from localStorage
   */
  loadProgress() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }

    // Return default progress structure
    return {
      completedLessons: [],
      lastAccessedLesson: null,
      startedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save progress to localStorage
   */
  saveProgress() {
    try {
      this.progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  /**
   * Get current progress
   */
  getProgress() {
    return { ...this.progress };
  }

  /**
   * Mark a lesson as complete
   */
  markLessonComplete(lessonId) {
    if (!this.progress.completedLessons.includes(lessonId)) {
      this.progress.completedLessons.push(lessonId);
      this.progress.lastAccessedLesson = lessonId;
      this.saveProgress();
      return true;
    }
    return false;
  }

  /**
   * Check if a lesson is complete
   */
  isLessonComplete(lessonId) {
    return this.progress.completedLessons.includes(lessonId);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(totalLessons = 23) {
    const completed = this.progress.completedLessons.length;
    return Math.round((completed / totalLessons) * 100);
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      localStorage.removeItem(this.storageKey);
      this.progress = {
        completedLessons: [],
        lastAccessedLesson: null,
        startedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      return true;
    }
    return false;
  }

  /**
   * Render progress view
   */
  render() {
    const statsContainer = document.getElementById('progress-stats');
    const lessonsContainer = document.getElementById('progress-lessons');

    if (!statsContainer || !lessonsContainer) return;

    // Render statistics
    const lessonsData = this.getLessonsData();
    const totalLessons = lessonsData.length;
    const completed = this.progress.completedLessons.length;
    const percentage = Math.round((completed / totalLessons) * 100);

    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-card__value">${completed}</div>
        <p class="stat-card__label">Lessons Completed</p>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${totalLessons - completed}</div>
        <p class="stat-card__label">Lessons Remaining</p>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${percentage}%</div>
        <p class="stat-card__label">Progress</p>
      </div>
    `;

    // Render lesson progress list
    lessonsContainer.innerHTML = `
      <h3>Lesson Progress</h3>
      <div class="progress-lesson-list">
        ${lessonsData.map(lesson => {
          const isComplete = this.isLessonComplete(lesson.id);
          return `
            <div class="progress-lesson-item ${isComplete ? 'completed' : ''}">
              <span class="progress-lesson-item__icon">
                ${isComplete ? '✓' : '○'}
              </span>
              <div class="progress-lesson-item__content">
                <h4>${lesson.title}</h4>
                <p>${isComplete ? 'Completed' : 'Not started'}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="progress-actions">
        <button id="reset-progress" class="btn-secondary">Reset Progress</button>
      </div>
    `;

    // Add reset button handler
    const resetButton = document.getElementById('reset-progress');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (this.resetProgress()) {
          this.render(); // Re-render after reset
        }
      });
    }
  }

  /**
   * Get lessons data (centralized lesson list)
   */
  getLessonsData() {
    return [
      { id: 'lesson-01', title: 'Lesson 1: What is Programming?' },
      { id: 'lesson-02', title: 'Lesson 2: Variables and Data Types' },
      { id: 'lesson-03', title: 'Lesson 3: Input and Output' },
      { id: 'lesson-04', title: 'Lesson 4: Conditions (if/else)' },
      { id: 'lesson-05', title: 'Lesson 5: Loops (for and while)' },
      { id: 'lesson-06', title: 'Lesson 6: Functions' },
      { id: 'lesson-07', title: 'Lesson 7: Lists and Dictionaries' },
      { id: 'lesson-08', title: 'Lesson 8: File Handling' },
      { id: 'lesson-09', title: 'Lesson 9: Error Handling' },
      { id: 'lesson-10', title: 'Lesson 10: Introduction to OOP' },
      { id: 'lesson-10-5', title: 'Lesson 10.5: List Methods & Comprehensions' },
      { id: 'lesson-11', title: 'Lesson 11: Working with External Libraries' },
      { id: 'lesson-12', title: 'Lesson 12: Working with APIs' },
      { id: 'lesson-13', title: 'Lesson 13: Data Processing Basics' },
      { id: 'lesson-14', title: 'Lesson 14: Web Development with Flask' },
      { id: 'lesson-15', title: 'Lesson 15: Building Web Applications' },
      { id: 'lesson-16', title: 'Lesson 16: Building REST APIs' },
      { id: 'lesson-17', title: 'Lesson 17: Working with Databases' },
      { id: 'lesson-18', title: 'Lesson 18: Data Analysis' },
      { id: 'lesson-19', title: 'Lesson 19: Automation and Scripting' },
      { id: 'lesson-20', title: 'Lesson 20: Testing and Quality' },
      { id: 'lesson-21', title: 'Lesson 21: Debugging Strategies' },
      { id: 'lesson-22', title: 'Lesson 22: Real-World Mini Projects' },
      { id: 'lesson-23', title: 'Lesson 23: Web Scraping Introduction' },
      { id: 'lesson-24', title: 'Lesson 24: API Basics' },
      { id: 'lesson-25', title: 'Lesson 25: Final Capstone Project' },
      { id: 'lesson-23-bonus', title: 'Bonus: Creating Games with Python' }
    ];
  }
}

