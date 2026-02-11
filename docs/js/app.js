/**
 * Main Application Entry Point
 * Handles navigation, initialization, and module coordination
 */

import { LessonViewer } from './lesson-viewer.js?v=44';
import { CodeEditor } from './code-editor.js?v=44';
import { ProgressTracker } from './progress-tracker.js?v=44';
import { Settings } from './settings.js?v=44';
import { AITutor } from './ai-tutor.js?v=44';
import { Config } from './config.js?v=44';
import { AuthManager } from './auth-manager.js?v=44';
import { Launchpad } from './launchpad.js?v=44';
import { gamification } from './error-handler.js?v=44';
import { errorHandler as friendlyErrorHandler } from './gamification.js?v=44';

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
    this.errorHandler = friendlyErrorHandler;
    this.gamification = gamification;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    // Check for Google OAuth Token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        // We just returned from Google Login
        this.authManager.setToken(token);
        // Remove token from URL for clean history
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    this.setupNavigation();
    this.setupLessonList();
    this.setupAuthUI();
    this.setupResourcesUI();
    this.setupGamificationUI();
    this.loadInitialView();
    
    // Inject AI tutor into lesson viewer
    this.lessonViewer.setAITutor(this.aiTutor);
    
    // Check Auth State
    if (this.authManager.isAuthenticated) {
        await this.authManager.fetchUserProfile();
        this.updateAuthButtonState();
    }

    // Dropdown Logic
    const menuBtn = document.getElementById('user-menu-btn');
    const menuContent = document.getElementById('user-dropdown');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // If not logged in, just open auth modal
            if (!this.authManager.isAuthenticated) {
                this.switchView('auth');
                return;
            }
            // Toggle dropdown
            menuContent.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', () => {
            if (menuContent.classList.contains('show')) {
                menuContent.classList.remove('show');
            }
        });
    }

    // Menu Item Clicks
    document.getElementById('menu-profile')?.addEventListener('click', () => this.showProfile());
    document.getElementById('menu-settings')?.addEventListener('click', () => this.switchView('settings'));
    document.getElementById('menu-security')?.addEventListener('click', () => this.showSecurity());
    document.getElementById('menu-logout')?.addEventListener('click', () => this.authManager.logout());
  }
  
  /**
   * Show Security view
   */
  showSecurity() {
    this.switchView('security');
    
    // Load user info into security view
    const user = this.authManager.user;
    if (user) {
      document.getElementById('security-username').textContent = user.username || '-';
      document.getElementById('security-email').textContent = user.email || '-';
      document.getElementById('security-created').textContent = user.created_at ? new Date(user.created_at).toLocaleDateString() : '-';
    }
    
    // Setup password change form
    const passwordForm = document.getElementById('change-password-form');
    if (passwordForm) {
      passwordForm.onsubmit = async (e) => {
        e.preventDefault();
        const currentPass = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirmPass = document.getElementById('confirm-password').value;
        const statusEl = document.getElementById('password-change-status');
        const submitBtn = passwordForm.querySelector('button[type="submit"]');
        
        if (newPass !== confirmPass) {
          statusEl.textContent = '❌ New passwords do not match';
          statusEl.className = 'status-message error';
          return;
        }
        
        if (newPass.length < 8) {
          statusEl.textContent = '❌ Password must be at least 8 characters';
          statusEl.className = 'status-message error';
          return;
        }
        
        // Disable button during API call
        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';
        
        // Call backend API to change password
        const result = await this.authManager.changePassword(currentPass, newPass);
        
        if (result.success) {
          statusEl.textContent = '✅ ' + result.message;
          statusEl.className = 'status-message success';
          passwordForm.reset();
        } else {
          statusEl.textContent = '❌ ' + result.error;
          statusEl.className = 'status-message error';
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Update Password';
      };
    }
    
    // Setup delete account button
    const deleteBtn = document.getElementById('delete-account-btn');
    if (deleteBtn) {
      deleteBtn.onclick = async () => {
        if (confirm('⚠️ WARNING: This will permanently delete your account and all progress.\n\nThis action cannot be undone.\n\nAre you sure you want to continue?')) {
          const confirmation = prompt('Type "DELETE" to permanently delete your account:');
          if (confirmation === 'DELETE') {
            deleteBtn.disabled = true;
            deleteBtn.textContent = 'Deleting...';
            
            // Call backend API to delete account
            const result = await this.authManager.deleteAccount();
            
            if (result.success) {
              alert('✅ Account deleted successfully. You have been logged out.');
            } else {
              alert('❌ Failed to delete account: ' + result.error);
              deleteBtn.disabled = false;
              deleteBtn.textContent = 'Delete Account';
            }
          }
        }
      };
    }
  }
  
  async showProfile() {
      this.switchView('profile');
      const user = this.authManager.user;
      if (!user) return;
      
      document.getElementById('profile-fullname').innerText = `${user.first_name} ${user.last_name}`;
      document.getElementById('profile-username').innerText = `@${user.username}`;
      document.getElementById('profile-xp').innerText = user.xp || 0;
      document.getElementById('profile-level').innerText = `Level ${user.level || 1}`;
      document.getElementById('profile-title').innerText = user.title || 'Novice Coder';
      
      // Calculate lessons
      const progress = this.progressTracker.getProgress();
      document.getElementById('profile-lessons').innerText = progress.completedLessons.length;
      
      // Populate edit form
      document.getElementById('edit-firstname').value = user.first_name || '';
      document.getElementById('edit-lastname').value = user.last_name || '';
      document.getElementById('edit-email').value = user.email || '';
      
      // Setup edit form handler
      const editForm = document.getElementById('profile-edit-form');
      if (editForm) {
          editForm.onsubmit = async (e) => {
              e.preventDefault();
              const statusEl = document.getElementById('profile-edit-status');
              const submitBtn = editForm.querySelector('button[type="submit"]');
              
              const profileData = {
                  first_name: document.getElementById('edit-firstname').value,
                  last_name: document.getElementById('edit-lastname').value,
                  email: document.getElementById('edit-email').value
              };
              
              submitBtn.disabled = true;
              submitBtn.textContent = 'Saving...';
              
              const result = await this.authManager.updateProfile(profileData);
              
              if (result.success) {
                  statusEl.textContent = '✅ Profile updated successfully!';
                  statusEl.className = 'status-message success';
                  // Update displayed info
                  document.getElementById('profile-fullname').innerText = `${result.user.first_name} ${result.user.last_name}`;
                  this.updateAuthButtonState();
              } else {
                  statusEl.textContent = '❌ ' + result.error;
                  statusEl.className = 'status-message error';
              }
              
              submitBtn.disabled = false;
              submitBtn.textContent = 'Save Changes';
          };
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
    const nameGroup = document.getElementById('name-group');
    const dobGroup = document.getElementById('dob-group');
    const errorMsg = document.getElementById('auth-error');
    
    let isRegisterMode = false;
    
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        title.innerText = isRegisterMode ? 'Register' : 'Login';
        submitBtn.innerText = isRegisterMode ? 'Register' : 'Login';
        
        // Toggle visibility
        emailGroup.style.display = isRegisterMode ? 'block' : 'none';
        
        // Ensure name/dob groups exist before accessing style
        if (nameGroup) nameGroup.style.display = isRegisterMode ? 'flex' : 'none';
        if (dobGroup) dobGroup.style.display = isRegisterMode ? 'block' : 'none';
        
        toggleBtn.innerText = isRegisterMode ? 'Login' : 'Register';
        errorMsg.innerText = '';
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('auth-username').value;
        const password = document.getElementById('auth-password').value;
        const email = document.getElementById('auth-email').value;
        const firstName = document.getElementById('auth-firstname')?.value || '';
        const lastName = document.getElementById('auth-lastname')?.value || '';
        const dob = document.getElementById('auth-dob')?.value || '';
        
        submitBtn.disabled = true;
        errorMsg.innerText = '';
        
        let result;
        if (isRegisterMode) {
            result = await this.authManager.register(username, password, email, firstName, lastName, dob);
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

    // Google Login Handler - Direct Attachment
    // Use a timeout to ensure DOM is ready if modal logic interferes
    setTimeout(() => {
        const googleBtn = document.getElementById('auth-google');
        if (googleBtn) {
            // Remove old listeners to prevent duplicates
            const newBtn = googleBtn.cloneNode(true);
            googleBtn.parentNode.replaceChild(newBtn, googleBtn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent any form submission
                e.stopPropagation();
                console.log("Google Login Clicked");
                
                // FORCE LIVE URL to prevent localhost issues
                const backend = 'https://flexjin.pythonanywhere.com';
                
                window.location.href = `${backend}/login/google`;
            });
        } else {
            console.error("Google Login Button not found in DOM");
        }
    }, 500);
  }
  
  updateAuthButtonState() {
    const btn = document.getElementById('user-menu-btn');
    const nameSpan = document.getElementById('user-name');
    const avatarSpan = document.getElementById('user-avatar');
    const dropdown = document.getElementById('user-dropdown');
    
    if (!btn) return;
    
    if (this.authManager.isAuthenticated && this.authManager.user) {
        const user = this.authManager.user;
        nameSpan.innerText = user.first_name || user.username;
        avatarSpan.innerText = user.avatar_url || '👤'; // Use emoji or image
        
        // Remove old click handler and add new one
        btn.onclick = (e) => {
            e.stopPropagation();
            if (!this.authManager.isAuthenticated) {
                this.switchView('auth');
                return;
            }
            // Toggle dropdown
            dropdown.classList.toggle('show');
        };
    } else {
        nameSpan.innerText = 'Login / Register';
        avatarSpan.innerText = '👤';
        if (dropdown) dropdown.classList.remove('show');
        
        // Reset to open login modal
        btn.onclick = () => this.switchView('auth');
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
   * Setup Gamification UI
   */
  setupGamificationUI() {
      // Gamification system handles its own notifications
      // This method is called during initialization but doesn't need explicit UI setup
      // The gamification system shows notifications dynamically when events occur
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
        id: 'lesson-10-5',
        number: 10.5,
        title: 'List Methods & Comprehensions',
        description: 'Master powerful list operations like methods, sorting, and list comprehensions.'
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
        title: 'Debugging Strategies',
        description: 'Learn to find and fix bugs in your Python code like a pro detective!'
      },
      {
        id: 'lesson-22',
        number: 22,
        title: 'Real-World Mini Projects',
        description: 'Build practical, useful Python projects: calculator, to-do list, and more!'
      },
      {
        id: 'lesson-23',
        number: 23,
        title: 'Web Scraping Introduction',
        description: 'Learn to automatically extract data from websites using BeautifulSoup and requests.'
      },
      {
        id: 'lesson-24',
        number: 24,
        title: 'API Basics',
        description: 'Connect to web services and get data programmatically using REST APIs.'
      },
      {
        id: 'lesson-25',
        number: 25,
        title: 'Final Capstone Project',
        description: 'Build a complete, portfolio-worthy Python application that showcases everything you have learned!'
      },
      {
        id: 'lesson-23-bonus',
        number: 26,
        title: '🎮 Bonus: Creating Games with Python',
        description: 'Learn to create fun games! Text adventures, quizzes, visualizations, and more.'
      }
    ];
  }

  /**
   * Switch between main views
   */
  switchView(viewName) {
    // Redirect if trying to access login while authenticated
    if (viewName === 'auth' && this.authManager.isAuthenticated) {
        this.showProfile();
        return;
    }

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
      'auth': 'auth-view',
      'profile': 'profile-view',
      'security': 'security-view'
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
