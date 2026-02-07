/**
 * Voice Narrator Module
 * Text-to-speech narration using Web Speech API (browser built-in, free)
 * 
 * Following REQUIREMENTS.md:
 * - Optional voice narration
 * - Play/pause/speed controls
 * - No audio required for completion
 */

import { Config } from './config.js';

export class VoiceNarrator {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.utterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentText = '';
    this.voices = [];
    
    // Check if Web Speech API is available
    this.isAvailable = 'speechSynthesis' in window;
    
    if (this.isAvailable) {
      this.loadVoices();
      // Voices load asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  /**
   * Load available voices
   */
  loadVoices() {
    this.voices = this.synthesis.getVoices();
    console.log(`🔊 Voice Narrator: ${this.voices.length} voices available`);
  }

  /**
   * Check if voice narration is enabled
   */
  isEnabled() {
    return Config.voice.enabled && this.isAvailable;
  }

  /**
   * Extract text content from lesson HTML
   * Removes code blocks and navigation elements
   */
  extractLessonText(htmlContent) {
    // Create temporary element to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;

    // Remove code blocks (don't read code aloud)
    temp.querySelectorAll('.code-block, pre, code').forEach(el => el.remove());
    
    // Remove navigation and UI elements
    temp.querySelectorAll('button, input, select').forEach(el => el.remove());

    // Get clean text
    let text = temp.textContent || temp.innerText;
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  /**
   * Start reading lesson
   */
  speak(text) {
    if (!this.isEnabled()) {
      console.warn('Voice narration not available or disabled');
      return false;
    }

    // Stop any current speech
    this.stop();

    // Prepare text
    this.currentText = text;
    
    // Create utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings from Config
    this.utterance.rate = Config.voice.rate || 1.0;
    this.utterance.pitch = Config.voice.pitch || 1.0;
    this.utterance.volume = Config.voice.volume || 1.0;

    // Select voice if specified
    if (Config.voice.voiceName && this.voices.length > 0) {
      const selectedVoice = this.voices.find(v => v.name === Config.voice.voiceName);
      if (selectedVoice) {
        this.utterance.voice = selectedVoice;
      }
    }

    // Event handlers
    this.utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.onStateChange('playing');
    };

    this.utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.onStateChange('stopped');
    };

    this.utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      this.isPlaying = false;
      this.isPaused = false;
      this.onStateChange('error');
    };

    // Start speaking
    this.synthesis.speak(this.utterance);
    
    return true;
  }

  /**
   * Pause narration
   */
  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.synthesis.pause();
      this.isPaused = true;
      this.onStateChange('paused');
    }
  }

  /**
   * Resume narration
   */
  resume() {
    if (this.isPaused) {
      this.synthesis.resume();
      this.isPaused = false;
      this.onStateChange('playing');
    }
  }

  /**
   * Stop narration
   */
  stop() {
    if (this.isPlaying || this.isPaused) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.onStateChange('stopped');
    }
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause() {
    if (this.isPlaying && !this.isPaused) {
      this.pause();
    } else if (this.isPaused) {
      this.resume();
    } else {
      // Start new if stopped
      return false; // Caller should call speak()
    }
    return true;
  }

  /**
   * Set speech rate
   */
  setRate(rate) {
    Config.voice.rate = Math.max(0.5, Math.min(2.0, rate));
    
    // If currently playing, need to restart with new rate
    if (this.isPlaying && this.currentText) {
      const wasPlaying = !this.isPaused;
      this.stop();
      this.speak(this.currentText);
      if (!wasPlaying) {
        this.pause();
      }
    }
  }

  /**
   * Set speech pitch
   */
  setPitch(pitch) {
    Config.voice.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  /**
   * Get current state
   */
  getState() {
    if (this.isPlaying && !this.isPaused) {
      return 'playing';
    } else if (this.isPaused) {
      return 'paused';
    } else {
      return 'stopped';
    }
  }

  /**
   * State change callback (can be overridden)
   */
  onStateChange(state) {
    // Can be overridden by caller to update UI
    console.log(`Voice state: ${state}`);
  }

  /**
   * Get available voices
   */
  getVoices() {
    return this.voices;
  }

  /**
   * Get recommended voices (English, good quality)
   */
  getRecommendedVoices() {
    return this.voices.filter(voice => 
      voice.lang.startsWith('en') && 
      !voice.name.includes('(Enhanced)') // Filter out some low-quality voices
    );
  }
}




