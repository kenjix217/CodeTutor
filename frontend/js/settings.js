/**
 * Settings Module
 * Handles user settings and configuration management
 */

import { Config, updateConfig, validateConfig } from './config.js';

export class Settings {
  constructor() {
    this.setupEventHandlers();
    this.loadSettingsToUI();
  }

  /**
   * Set up event handlers for settings controls
   */
  setupEventHandlers() {
    // Save settings button
    const saveBtn = document.getElementById('save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveSettings());
    }

    // Reset settings button
    const resetBtn = document.getElementById('reset-settings');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetSettings());
    }

    // Provider selection - show/hide custom endpoint
    const providerSelect = document.getElementById('ai-provider');
    if (providerSelect) {
      providerSelect.addEventListener('change', (e) => {
        const customEndpointItem = document.getElementById('custom-endpoint-item');
        if (customEndpointItem) {
          customEndpointItem.style.display = 
            e.target.value === 'custom' ? 'block' : 'none';
        }
      });
    }

    // Voice rate slider
    const voiceRateSlider = document.getElementById('voice-rate');
    const voiceRateValue = document.getElementById('voice-rate-value');
    if (voiceRateSlider && voiceRateValue) {
      voiceRateSlider.addEventListener('input', (e) => {
        voiceRateValue.textContent = e.target.value + 'x';
      });
    }

    // Voice pitch slider
    const voicePitchSlider = document.getElementById('voice-pitch');
    const voicePitchValue = document.getElementById('voice-pitch-value');
    if (voicePitchSlider && voicePitchValue) {
      voicePitchSlider.addEventListener('input', (e) => {
        voicePitchValue.textContent = e.target.value;
      });
    }
  }

  /**
   * Load current settings into UI
   */
  loadSettingsToUI() {
    // AI settings
    const aiEnabled = document.getElementById('ai-enabled');
    if (aiEnabled) aiEnabled.checked = Config.ai.enabled;

    const aiProvider = document.getElementById('ai-provider');
    if (aiProvider) aiProvider.value = Config.ai.provider;

    const aiKey = document.getElementById('ai-key');
    if (aiKey) aiKey.value = Config.ai.apiKey || '';

    const aiModel = document.getElementById('ai-model');
    if (aiModel) aiModel.value = Config.ai.model || '';

    const aiCustomEndpoint = document.getElementById('ai-custom-endpoint');
    if (aiCustomEndpoint) aiCustomEndpoint.value = Config.ai.customEndpoint || '';

    const useBackendProxy = document.getElementById('use-backend-proxy');
    if (useBackendProxy) useBackendProxy.checked = Config.platform.useBackendProxy || false;

    // Voice settings
    const voiceEnabled = document.getElementById('voice-enabled');
    if (voiceEnabled) voiceEnabled.checked = Config.voice.enabled;

    const voiceRate = document.getElementById('voice-rate');
    if (voiceRate) voiceRate.value = Config.voice.rate;

    const voicePitch = document.getElementById('voice-pitch');
    if (voicePitch) voicePitch.value = Config.voice.pitch;

    // Platform settings
    const requireHomework = document.getElementById('require-homework');
    if (requireHomework) requireHomework.checked = Config.features.requireHomeworkValidation;

    // Show/hide custom endpoint based on provider
    const customEndpointItem = document.getElementById('custom-endpoint-item');
    if (customEndpointItem) {
      customEndpointItem.style.display = 
        Config.ai.provider === 'custom' ? 'block' : 'none';
    }
  }

  /**
   * Save settings from UI to Config
   */
  saveSettings() {
    try {
      // Get values from UI
      const aiEnabled = document.getElementById('ai-enabled')?.checked || false;
      const aiProvider = document.getElementById('ai-provider')?.value || 'openrouter';
      const aiKey = document.getElementById('ai-key')?.value?.trim() || '';
      const aiModel = document.getElementById('ai-model')?.value?.trim() || '';
      const aiCustomEndpoint = document.getElementById('ai-custom-endpoint')?.value?.trim() || '';
      const useBackendProxy = document.getElementById('use-backend-proxy')?.checked ?? false;

      const voiceEnabled = document.getElementById('voice-enabled')?.checked ?? true;
      const voiceRate = parseFloat(document.getElementById('voice-rate')?.value || 1.0);
      const voicePitch = parseFloat(document.getElementById('voice-pitch')?.value || 1.0);

      const requireHomework = document.getElementById('require-homework')?.checked ?? true;

      // Update Config
      updateConfig({
        ai: {
          ...Config.ai,
          enabled: aiEnabled,
          provider: aiProvider,
          apiKey: aiKey,
          model: aiModel || Config.ai.model,
          customEndpoint: aiCustomEndpoint
        },
        voice: {
          ...Config.voice,
          enabled: voiceEnabled,
          rate: voiceRate,
          pitch: voicePitch
        },
        features: {
          ...Config.features,
          requireHomeworkValidation: requireHomework,
          showAITutor: aiEnabled && aiKey !== ''
        },
        platform: {
          ...Config.platform,
          useBackendProxy
        }
      });

      // Show success message
      this.showStatus('✅ Settings saved successfully!', 'success');

      // Update UI based on new settings
      this.updateUIFeatures();

    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('❌ Error saving settings: ' + error.message, 'error');
    }
  }

  /**
   * Reset settings to defaults
   */
  resetSettings() {
    if (confirm('Reset all settings to defaults? This will clear your API key.')) {
      // Clear saved config
      localStorage.removeItem('python-tutor-config');
      
      // Reload page to reinitialize
      window.location.reload();
    }
  }

  /**
   * Show status message
   */
  showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('settings-status');
    if (!statusDiv) return;

    statusDiv.textContent = message;
    statusDiv.className = `settings-status ${type}`;
    statusDiv.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }

  /**
   * Update UI features based on settings
   * Shows/hides AI tutor button, etc.
   */
  updateUIFeatures() {
    // Update AI tutor button visibility
    const aiButtons = document.querySelectorAll('.ai-tutor-button');
    aiButtons.forEach(btn => {
      btn.style.display = Config.features.showAITutor ? 'inline-block' : 'none';
    });

    // Log feature status
    console.log('🔧 Features updated:');
    console.log('   AI Tutor:', Config.features.showAITutor ? 'Enabled' : 'Disabled');
    console.log('   Voice:', Config.voice.enabled ? 'Enabled' : 'Disabled');
    console.log('   Homework Required:', Config.features.requireHomeworkValidation ? 'Yes' : 'No');
  }

  /**
   * Get current settings summary
   */
  getSettingsSummary() {
    return {
      aiEnabled: Config.ai.enabled && Config.ai.apiKey !== '',
      voiceEnabled: Config.voice.enabled,
      homeworkRequired: Config.features.requireHomeworkValidation,
      provider: Config.ai.provider,
      model: Config.ai.model
    };
  }
}




