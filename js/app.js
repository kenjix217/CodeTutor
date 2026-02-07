/**
 * Main Application Entry Point
 * Handles navigation, initialization, and module coordination
 */

import { LessonViewer } from './lesson-viewer.js?v=40';
import { CodeEditor } from './code-editor.js?v=40';
import { ProgressTracker } from './progress-tracker.js?v=40';
import { Settings } from './settings.js?v=40';
import { AITutor } from './ai-tutor.js?v=40';
import { Config } from './config.js?v=40';
import { AuthManager } from './auth-manager.js?v=40';
import { Launchpad } from './launchpad.js?v=40';

class PythonTutorApp {
  constructor() {
    this.currentView = 'lessons';
    this.lessonViewer = new LessonViewer();
    this.codeEditor = new CodeEditor();
    this.progressTracker = new ProgressTracker();
    this.settings = new Settings();
    this.aiTutor = new AITutor();
    this.authManager = new AuthManager();
    this.launchpad = new Launchpad();
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    this.setupNavigation();
    this.setupLessonList();
    this.setupAuthUI();
    this.setupResourcesUI();
    this.loadInitialView();
    
    // Inject AI tutor into lesson viewer
    this.lessonViewer.setAITutor(this.aiTutor);
    
    // Check Auth State
    if (this.authManager.isAuthenticated) {
        await this.authManager.fetchUserProfile();
        this.updateAuthButtonState();
    }
  }

  /**
   * Set up navigation event listeners
   */
  setupNavigation() {
    const navButtons = {
      'nav-lessons': 'lessons',
      'nav-practice': 'practice',
      'nav-progress': 'progress',
      'nav-resources': 'resources',
      'nav-settings': 'settings',
      'nav-auth': 'auth'
    };

    Object.entries(navButtons).forEach(([buttonId, viewName]) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', () => this.switchView(viewName));
      }
    });

    // Back to lessons button
    const backButton = document.getElementById('back-to-lessons');
    if (backButton) {
      backButton.addEventListener('click', () => this.showLessonList());
    }
  }
  
  /**
   * Setup Auth UI Logic
   */
  setupAuthUI() {
    const form = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('auth-toggle-mode');
    const submitBtn = document.getElementById('auth-submit');
    const title = document.getElementById('auth-title');
    const emailGroup = document.getElementById('email-group');
    const errorMsg = document.getElementById('auth-error');
    
    let isRegisterMode = false;
    
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        title.innerText = isRegisterMode ? 'Register' : 'Login';
        submitBtn.innerText = isRegisterMode ? 'Register' : 'Login';
        emailGroup.style.display = isRegisterMode ? 'block' : 'none';
        toggleBtn.innerText = isRegisterMode ? 'Login' : 'Register';
        errorMsg.innerText = '';
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('auth-username').value;
        const password = document.getElementById('auth-password').value;
        const email = document.getElementById('auth-email').value;
        
        submitBtn.disabled = true;
        errorMsg.innerText = '';
        
        let result;
        if (isRegisterMode) {
            result = await this.authManager.register(username, password, email);
        } else {
            result = await this.authManager.login(username, password);
        }
        
        if (result.success) {
            this.updateAuthButtonState();
            this.switchView('lessons');
        } else {
            errorMsg.innerText = result.error || 'Authentication failed';
        }
        submitBtn.disabled = false;
    });
  }
  
  updateAuthButtonState() {
    const btn = document.getElementById('nav-auth');
    if (this.authManager.isAuthenticated) {
        btn.innerText = `👤 ${this.authManager.user?.username || 'Profile'}`;
        // Optional: Change click behavior to show profile/logout instead of login form
        // For MVP, clicking it again shows Auth View which we can turn into a Profile view later
    } else {
        btn.innerText = 'Login';
    }
  }

  /**
   * Setup Resources UI (Launchpad)
   */
  setupResourcesUI() {
      const btn = document.getElementById('download-starter-kit');
      if (btn) {
          btn.addEventListener('click', async () => {
             btn.disabled = true;
             btn.innerText = "Generating ZIP...";
             await this.launchpad.generateStarterKit();
             btn.innerText = "📦 Download Starter Kit (.zip)";
             btn.disabled = false;
          });
      }
  }

  /**
   * Set up lesson list
   */
  setupLessonList() {
    const lessonListContainer = document.getElementById('lesson-list');
    if (!lessonListContainer) return;

    const lessons = this.getLessons();
    const progress = this.progressTracker.getProgress();

    lessonListContainer.innerHTML = lessons.map(lesson => {
      const isCompleted = progress.completedLessons.includes(lesson.id);
      
      return `
        <div class="lesson-card" data-lesson-id="${lesson.id}">
          <div class="lesson-card__header">
            <span class="lesson-card__number">Lesson ${lesson.number}</span>
            ${isCompleted ? '<span class="lesson-card__status lesson-card__status--completed">Completed</span>' : ''}
          </div>
          <h3 class="lesson-card__title">${lesson.title}</h3>
          <p class="lesson-card__description">${lesson.description}</p>
        </div>
      `;
    }).join('');

    // Add click handlers to lesson cards
    lessonListContainer.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const lessonId = card.dataset.lessonId;
        this.openLesson(lessonId);
      });
    });
  }

  /**
   * Get available lessons
   */
  getLessons() {
    return [
      {
        id: 'lesson-01',
        number: 1,
        title: 'What is Programming?',
        description: 'Understand what programming is and why Python is a great first language to learn.'
      },
      {
        id: 'lesson-02',
        number: 2,
        title: 'Variables and Data Types',
        description: 'Learn how to store and work with different types of data in Python.'
      },
      {
        id: 'lesson-03',
        number: 3,
        title: 'Input and Output',
        description: 'Discover how to get information from users and display results.'
      },
      {
        id: 'lesson-04',
        number: 4,
        title: 'Conditions (if/else)',
        description: 'Learn how to make your programs make decisions using if, elif, and else statements.'
      },
      {
        id: 'lesson-05',
        number: 5,
        title: 'Loops (for and while)',
        description: 'Discover how to make your programs repeat actions using for loops and while loops.'
      },
      {
        id: 'lesson-06',
        number: 6,
        title: 'Functions',
        description: 'Learn how to organize code into reusable functions that make programs cleaner and easier to maintain.'
      },
      {
        id: 'lesson-07',
        number: 7,
        title: 'Lists and Dictionaries',
        description: 'Master working with collections of data using lists and dictionaries for powerful data management.'
      },
      {
        id: 'lesson-08',
        number: 8,
        title: 'File Handling',
        description: 'Learn how to read from and write to files to save and load data permanently.'
      },
      {
        id: 'lesson-09',
        number: 9,
        title: 'Error Handling',
        description: 'Understand how to handle errors gracefully using try, except, and finally statements.'
      },
      {
        id: 'lesson-10',
        number: 10,
        title: 'Introduction to OOP',
        description: 'Learn Object-Oriented Programming basics: classes, objects, attributes, and methods.'
      },
      {
        id: 'lesson-11',
        number: 11,
        title: 'Working with External Libraries',
        description: 'Learn to use Python libraries to expand capabilities: datetime, json, math, and more.'
      },
      {
        id: 'lesson-12',
        number: 12,
        title: 'Working with APIs',
        description: 'Understand APIs and learn to fetch data from web services using HTTP requests.'
      },
      {
        id: 'lesson-13',
        number: 13,
        title: 'Data Processing Basics',
        description: 'Master reading and processing CSV files for real-world data analysis.'
      },
      {
        id: 'lesson-14',
        number: 14,
        title: 'Web Development with Flask',
        description: 'Introduction to building web applications using the Flask framework.'
      },
      {
        id: 'lesson-15',
        number: 15,
        title: 'Building Web Applications',
        description: 'Create interactive web apps with forms, templates, and user input handling.'
      },
      {
        id: 'lesson-16',
        number: 16,
        title: 'Building REST APIs',
        description: 'Learn to create REST APIs that other programs can use to access your services.'
      },
      {
        id: 'lesson-17',
        number: 17,
        title: 'Working with Databases',
        description: 'Master SQLite databases: creating tables, queries, and data persistence.'
      },
      {
        id: 'lesson-18',
        number: 18,
        title: 'Data Analysis with Python',
        description: 'Analyze data, calculate statistics, and find patterns in real-world datasets.'
      },
      {
        id: 'lesson-19',
        number: 19,
        title: 'Automation and Scripting',
        description: 'Automate repetitive tasks: file operations, reports, and workflow automation.'
      },
      {
        id: 'lesson-20',
        number: 20,
        title: 'Testing and Code Quality',
        description: 'Write unit tests and ensure code quality with professional testing practices.'
      },
      {
        id: 'lesson-21',
        number: 21,
        title: 'Deployment and Production',
        description: 'Deploy applications to the cloud and manage production environments.'
      },
      {
        id: 'lesson-22',
        number: 22,
        title: 'Best Practices & Final Project',
        description: 'Master professional practices and complete a comprehensive final project.'
      },
      {
        id: 'lesson-23-bonus',
        number: 23,
        title: '🎮 Bonus: Creating Games with Python',
        description: 'Learn to create fun games! Text adventures, quizzes, visualizations, and more.'
      }
    ];
  }

  /**
   * Switch between main views
   */
  switchView(viewName) {
    // Update navigation buttons
    document.querySelectorAll('.nav-button').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`nav-${viewName}`);
    if (activeBtn) activeBtn.classList.add('active');

    // View Mapping
    const viewMap = {
      'lessons': 'lesson-list-view',
      'practice': 'practice-view',
      'progress': 'progress-view',
      'resources': 'resources-view',
      'settings': 'settings-view',
      'auth': 'auth-view'
    };

    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(viewMap[viewName]);
    if (targetView) {
      targetView.classList.add('active');
      this.currentView = viewName;

      // Initialize view-specific content
      if (viewName === 'practice') {
        this.codeEditor.initializeIfNeeded();
      } else if (viewName === 'progress') {
        this.progressTracker.render();
      } else if (viewName === 'settings') {
        this.settings.loadSettingsToUI();
      }
    }
  }

  /**
   * Open a specific lesson
   */
  async openLesson(lessonId) {
    try {
      this.showLoading(true);
      await this.lessonViewer.loadLesson(lessonId);
      
      // Switch to lesson view
      document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
      });
      document.getElementById('lesson-view').classList.add('active');
      
      this.showLoading(false);
    } catch (error) {
      console.error('Error opening lesson:', error);
      this.showError('Failed to load lesson. Please try again.');
      this.showLoading(false);
    }
  }

  /**
   * Show lesson list
   */
  showLessonList() {
    this.switchView('lessons');
    this.setupLessonList();
  }

  /**
   * Load initial view
   */
  loadInitialView() {
    this.switchView('lessons');
  }

  /**
   * Show or hide loading indicator
   */
  showLoading(show) {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.setAttribute('aria-hidden', !show);
    }
  }

  /**
   * Show error message to user
   */
  showError(message) {
    alert(message);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pythonTutorApp = new PythonTutorApp();
  });
} else {
  window.pythonTutorApp = new PythonTutorApp();
}
