/**
 * Lesson Viewer Module
 * Handles loading and displaying lesson content
 */

import { HomeworkValidator } from './homework-validator.js';
import { Config } from './config.js';
import { VoiceNarrator } from './voice-narrator.js';

export class LessonViewer {
  constructor() {
    this.currentLesson = null;
    this.homeworkValidator = new HomeworkValidator();
    this.aiTutor = null; // Will be set by app
    this.voiceNarrator = new VoiceNarrator();
    this.setupEventHandlers();
    this.setupVoiceControls();
  }

  /**
   * Set AI tutor instance (injected by app)
   */
  setAITutor(aiTutor) {
    this.aiTutor = aiTutor;
  }

  /**
   * Set up event handlers for lesson actions
   */
  setupEventHandlers() {
    const markCompleteBtn = document.getElementById('mark-complete');
    if (markCompleteBtn) {
      markCompleteBtn.addEventListener('click', () => this.markLessonComplete());
    }

    const nextLessonBtn = document.getElementById('next-lesson');
    if (nextLessonBtn) {
      nextLessonBtn.addEventListener('click', () => this.goToNextLesson());
    }

    // Homework validation handlers
    const checkHomeworkBtn = document.getElementById('check-homework');
    if (checkHomeworkBtn) {
      checkHomeworkBtn.addEventListener('click', () => this.checkHomework());
    }

    const clearHomeworkBtn = document.getElementById('clear-homework');
    if (clearHomeworkBtn) {
      clearHomeworkBtn.addEventListener('click', () => this.clearHomework());
    }

    // AI Tutor handlers
    const askAIBtn = document.getElementById('ask-ai-tutor');
    if (askAIBtn) {
      askAIBtn.addEventListener('click', () => this.toggleAIChat());
    }

    const aiChatToggle = document.getElementById('ai-chat-toggle');
    if (aiChatToggle) {
      aiChatToggle.addEventListener('click', () => this.toggleAIChat());
    }

    const aiChatSend = document.getElementById('ai-chat-send');
    if (aiChatSend) {
      aiChatSend.addEventListener('click', () => this.sendAIMessage());
    }

    const aiChatInput = document.getElementById('ai-chat-input');
    if (aiChatInput) {
      aiChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendAIMessage();
        }
      });
    }
  }

  /**
   * Set up voice narration controls
   */
  setupVoiceControls() {
    const playBtn = document.getElementById('voice-play');
    const pauseBtn = document.getElementById('voice-pause');
    const stopBtn = document.getElementById('voice-stop');
    const speedSelect = document.getElementById('voice-speed');

    if (playBtn) {
      playBtn.addEventListener('click', () => this.playLesson());
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        const state = this.voiceNarrator.getState();
        if (state === 'paused') {
          this.resumeLesson();
        } else {
          this.pauseLesson();
        }
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => this.stopLesson());
    }

    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        const rate = parseFloat(e.target.value);
        this.voiceNarrator.setRate(rate);
      });
    }

    // Set up state change callback
    this.voiceNarrator.onStateChange = (state) => this.updateVoiceUI(state);
  }

  /**
   * Load and display a lesson
   * @param {string} lessonId - The lesson identifier (e.g., 'lesson-01')
   */
  async loadLesson(lessonId) {
    try {
      const response = await fetch(`lessons/${lessonId}.md`);
      if (!response.ok) {
        throw new Error(`Failed to load lesson: ${response.status}`);
      }

      const markdown = await response.text();
      this.currentLesson = {
        id: lessonId,
        content: markdown
      };

      this.renderLesson();
    } catch (error) {
      console.error('Error loading lesson:', error);
      throw error;
    }
  }

  /**
   * Render the current lesson content
   */
  renderLesson() {
    if (!this.currentLesson) return;

    const lessonContent = document.getElementById('lesson-content');
    const lessonNumber = document.getElementById('lesson-number');
    const lessonTitle = document.getElementById('lesson-title');

    if (!lessonContent) return;

    // Parse markdown (simple version for now, will use marked.js later)
    const html = this.parseMarkdown(this.currentLesson.content);
    lessonContent.innerHTML = html;

    // Update lesson metadata
    const lessonNum = this.currentLesson.id.split('-')[1];
    if (lessonNumber) {
      lessonNumber.textContent = `Lesson ${parseInt(lessonNum, 10)}`;
    }

    // Extract title from content (first h1)
    const titleMatch = this.currentLesson.content.match(/^#\s+(.+)$/m);
    if (lessonTitle && titleMatch) {
      lessonTitle.textContent = titleMatch[1];
    }

    // Update "Mark as Complete" button based on progress
    this.updateCompleteButton();

    // Update homework section visibility
    this.updateHomeworkSection();

    // Update voice controls visibility
    this.updateVoiceControls();

    // Scroll to top
    window.scrollTo(0, 0);
  }

  /**
   * Parse markdown using Marked.js with custom configuration
   * Maintains our code block styling and beginner-friendly format
   */
  parseMarkdown(markdown) {
    // Configure Marked.js
    marked.setOptions({
      breaks: true,  // Convert single line breaks to <br>
      gfm: true,     // GitHub Flavored Markdown
      headerIds: false,  // Don't add IDs to headers
      mangle: false  // Don't escape email addresses
    });

    // Custom renderer to wrap code blocks in our styled div
    const renderer = new marked.Renderer();
    
    // Override code block rendering
    renderer.code = function(code, language) {
      // Marked.js v5+ passes options object, need to handle both APIs
      const codeText = typeof code === 'string' ? code : (code.text || '');
      const lang = typeof code === 'string' ? language : (code.lang || '');
      
      const langClass = lang ? ` class="language-${lang}"` : '';
      const escapedCode = codeText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      return `<div class="code-block"><pre><code${langClass}>${escapedCode}</code></pre></div>`;
    };

    // Override inline code rendering (keep our pink/purple style)
    renderer.codespan = function(code) {
      const codeText = typeof code === 'string' ? code : (code.text || '');
      const escapedCode = codeText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      return `<code>${escapedCode}</code>`;
    };

    // Use Marked.js with custom renderer
    const html = marked.parse(markdown, { renderer });
    
    return html;
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Update the "Mark as Complete" button based on current lesson status
   */
  updateCompleteButton() {
    if (!this.currentLesson) return;

    const markCompleteBtn = document.getElementById('mark-complete');
    if (!markCompleteBtn) return;

    // Check if current lesson is already completed
    const app = window.pythonTutorApp;
    if (app && app.progressTracker) {
      const isCompleted = app.progressTracker.isLessonComplete(this.currentLesson.id);
      
      if (isCompleted) {
        // Lesson is already complete
        markCompleteBtn.textContent = '✓ Completed';
        markCompleteBtn.disabled = true;
        markCompleteBtn.style.backgroundColor = 'var(--color-success)';
      } else {
        // Lesson not yet complete - reset to default state
        markCompleteBtn.textContent = 'Mark as Complete';
        markCompleteBtn.disabled = false;
        markCompleteBtn.style.backgroundColor = '';
      }
    }
  }

  /**
   * Mark the current lesson as complete
   * Following AI_TUTOR_RULES.md - requires mastery before progression
   */
  markLessonComplete() {
    if (!this.currentLesson) return;

    // Check if homework has been validated
    const homeworkInput = document.getElementById('homework-input');
    const homeworkCode = homeworkInput ? homeworkInput.value.trim() : '';

    // If lesson has homework validation, require it to pass
    if (this.homeworkValidator.testCases[this.currentLesson.id] && homeworkCode) {
      const validation = this.homeworkValidator.validateHomework(this.currentLesson.id, homeworkCode);
      
      if (!validation.valid) {
        this.showMessage(
          `📚 Please complete the homework successfully before marking this lesson complete.\n\n` +
          `Current progress: ${validation.passedTests}/${validation.totalTests} checks passed.\n\n` +
          `Review the feedback and try again. You're learning!`
        );
        return;
      }
    }

    // Get progress tracker from global app instance
    const app = window.pythonTutorApp;
    if (app && app.progressTracker) {
      app.progressTracker.markLessonComplete(this.currentLesson.id);
      
      // Update button state
      this.updateCompleteButton();

      // Show success message
      const hasHomework = this.homeworkValidator.testCases[this.currentLesson.id];
      const message = hasHomework
        ? '🎉 Lesson complete! You passed the homework validation. Great work!'
        : 'Lesson marked as complete! Great progress!';
      
      this.showMessage(message);
    }
  }

  /**
   * Navigate to the next lesson
   */
  goToNextLesson() {
    if (!this.currentLesson) return;

    const currentNum = parseInt(this.currentLesson.id.split('-')[1], 10);
    const nextNum = currentNum + 1;
    const nextLessonId = `lesson-${nextNum.toString().padStart(2, '0')}`;

    // Check if next lesson exists
    const app = window.pythonTutorApp;
    if (app) {
      const lessons = app.getLessons();
      const nextLesson = lessons.find(l => l.id === nextLessonId);
      
      if (nextLesson) {
        app.openLesson(nextLessonId);
      } else {
        this.showMessage('You have completed all available lessons!');
      }
    }
  }

  /**
   * Show a temporary message to the user
   */
  showMessage(message) {
    // Simple alert for now; can be enhanced with a custom toast/notification
    alert(message);
  }

  /**
   * Show or hide homework section based on lesson
   */
  updateHomeworkSection() {
    const homeworkSection = document.getElementById('homework-section');
    if (homeworkSection && this.currentLesson) {
      // Show homework section for lessons with validation
      homeworkSection.style.display = 'block';
      
      // Clear previous results
      const resultsContainer = document.getElementById('homework-results');
      if (resultsContainer) {
        resultsContainer.innerHTML = '';
      }
    }

    // Update AI tutor button visibility
    const askAIBtn = document.getElementById('ask-ai-tutor');
    if (askAIBtn) {
      askAIBtn.style.display = Config.features.showAITutor ? 'inline-block' : 'none';
    }

    // Set lesson context for AI tutor
    if (this.aiTutor && this.currentLesson) {
      const titleMatch = this.currentLesson.content?.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Current Lesson';
      this.aiTutor.setLessonContext(this.currentLesson.id, title);
    }
  }

  /**
   * Check student's homework
   */
  checkHomework() {
    const homeworkInput = document.getElementById('homework-input');
    const resultsContainer = document.getElementById('homework-results');
    
    if (!homeworkInput || !resultsContainer) return;
    
    const code = homeworkInput.value.trim();
    
    if (!code) {
      resultsContainer.innerHTML = '<p class="error-message">❌ Please paste your homework code first.</p>';
      return;
    }

    // Validate homework
    const validation = this.homeworkValidator.validateHomework(this.currentLesson.id, code);
    
    // Display results
    resultsContainer.innerHTML = this.homeworkValidator.formatResults(validation);
    
    // If homework passed, enable "Mark as Complete" button
    if (validation.valid) {
      const markCompleteBtn = document.getElementById('mark-complete');
      if (markCompleteBtn && !markCompleteBtn.disabled) {
        // Highlight the button to draw attention
        markCompleteBtn.style.animation = 'pulse 1s ease-in-out 3';
        markCompleteBtn.textContent = '✅ Mark as Complete (Homework Passed!)';
      }
    }
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Clear homework input
   */
  clearHomework() {
    const homeworkInput = document.getElementById('homework-input');
    const resultsContainer = document.getElementById('homework-results');
    
    if (homeworkInput) {
      homeworkInput.value = '';
    }
    
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }

  /**
   * Toggle AI chat section visibility
   */
  toggleAIChat() {
    const chatSection = document.getElementById('ai-chat-section');
    if (chatSection) {
      const isHidden = chatSection.style.display === 'none';
      chatSection.style.display = isHidden ? 'block' : 'none';
      
      // Update button text
      const toggleBtn = document.getElementById('ai-chat-toggle');
      if (toggleBtn) {
        toggleBtn.textContent = isHidden ? 'Close' : 'Open';
      }

      // Focus input if opening
      if (isHidden) {
        const input = document.getElementById('ai-chat-input');
        if (input) input.focus();
      }
    }
  }

  /**
   * Send message to AI tutor
   */
  async sendAIMessage() {
    if (!this.aiTutor) return; 
    
    const input = document.getElementById('ai-chat-input');
    const messagesContainer = document.getElementById('ai-chat-messages');
    
    if (!input || !messagesContainer) return; 
    
    const message = input.value.trim();
    if (!message) return; 
    
     // Add user message to UI
    this.addChatMessage('user', message);
    input.value = '';
    
    // Show loading
    const loadingId = this.addChatMessage('ai', '💭 Thinking...');
    
    try {
      // Get AI response
      const response = await this.aiTutor.chat(message);
      
      // Remove loading, add response
      this.removeChatMessage(loadingId);
      this.addChatMessage('ai', response);
      
    } catch (error) {
      this.removeChatMessage(loadingId);
      this.addChatMessage('ai', `Sorry, I encountered an error: ${error.message}`);
    }
  }
    
    // Add user message to UI
    this.addChatMessage('user', message);
    input.value = '';
    
    // Show loading
    const loadingId = this.addChatMessage('ai', '💭 Thinking...');
    
    try {
      // Get AI response
      const response = await this.aiTutor.chat(message);
      
      // Remove loading, add response
      this.removeChatMessage(loadingId);
      this.addChatMessage('ai', response);
      
    } catch (error) {
      this.removeChatMessage(loadingId);
      this.addChatMessage('ai', `Sorry, I encountered an error: ${error.message}`);
    }
  }

  /**
   * Check if text contains image data
   */
  containsImageData(text) {
    const imagePatterns = [
      /data:image\/[a-z]+;base64/i,
      /data:application\/pdf/i,
      /data:application\/msword/i,
      /\.(png|jpe?g|gif|bmp|webp|pdf|doc|docx)$/i,
      /^<img /i
    ];
    
    return imagePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Add message to chat UI
   */
  addChatMessage(role, content) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    if (!messagesContainer) return null;

    const messageId = `msg-${Date.now()}`;
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `ai-message ai-message-${role}`;
    messageDiv.textContent = content;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageId;
  }

  /**
   * Remove message from chat UI
   */
  removeChatMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
      message.remove();
    }
  }

  /**
   * Update voice controls visibility and state
   */
  updateVoiceControls() {
    const voiceControls = document.getElementById('voice-controls');
    
    if (voiceControls && this.voiceNarrator.isEnabled()) {
      voiceControls.style.display = 'flex';
    } else if (voiceControls) {
      voiceControls.style.display = 'none';
    }
  }

  /**
   * Play current lesson with voice
   */
  playLesson() {
    if (!this.currentLesson) return;

    const lessonContent = document.getElementById('lesson-content');
    if (!lessonContent) return;

    // Extract text from lesson
    const text = this.voiceNarrator.extractLessonText(lessonContent.innerHTML);
    
    // Start speaking
    const started = this.voiceNarrator.speak(text);
    
    if (!started) {
      alert('Voice narration is not available in your browser. Try Chrome, Edge, or Safari.');
    }
  }

  /**
   * Pause lesson narration
   */
  pauseLesson() {
    this.voiceNarrator.pause();
  }

  /**
   * Resume lesson narration
   */
  resumeLesson() {
    this.voiceNarrator.resume();
  }

  /**
   * Stop lesson narration
   */
  stopLesson() {
    this.voiceNarrator.stop();
  }

  /**
   * Update voice control UI based on state
   */
  updateVoiceUI(state) {
    const playBtn = document.getElementById('voice-play');
    const pauseBtn = document.getElementById('voice-pause');

    if (!playBtn || !pauseBtn) return;

    if (state === 'playing') {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';
      pauseBtn.textContent = '⏸️ Pause';
    } else if (state === 'paused') {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';
      pauseBtn.textContent = '▶️ Resume';
    } else {
      playBtn.style.display = 'inline-block';
      pauseBtn.style.display = 'none';
    }
  }
}

