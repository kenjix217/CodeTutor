/**
 * Configuration Module
 * Stores optional API keys and settings
 * 
 * IMPORTANT: This is for OPTIONAL features only.
 * The platform works 100% without any API keys.
 * 
 * Following FREE_TOOLS_AND_LICENSING.md:
 * - Platform core is completely free
 * - AI tutor is OPTIONAL enhancement
 * - Administrators can configure their own API keys
 * - Students can use platform without AI tutor
 */

export const Config = {
  /**
   * AI Tutor Configuration (OPTIONAL)
   * 
   * The platform works completely without this.
   * If you have an API key for an LLM service, you can add it here.
   * 
   * Supported providers:
   * - OpenRouter (https://openrouter.ai/)
   * - OpenAI (https://platform.openai.com/)
   * - Anthropic (https://www.anthropic.com/)
   * - Custom endpoint
   */
  ai: {
    // Set to true to enable AI tutor (requires API key below)
    enabled: true,
    
    // Your API provider
    provider: 'openrouter', // 'openrouter', 'openai', 'anthropic', or 'custom'
    
    // Your API key (keep this private!)
    // IMPORTANT: In production, use environment variables or backend proxy
    // NEVER commit API keys to public repositories
    apiKey: '', // User must provide their own key in Settings
    
    // Model to use (provider-specific)
    // User requested "glm 4.7free" - mapping to OpenRouter free GLM-4 model
    model: 'thudm/glm-4-9b-chat:free', 
    
    // Custom endpoint (if provider is 'custom')
    customEndpoint: '',
    
    // Request settings
    temperature: 0.7, // 0.0-1.0, lower = more focused
    maxTokens: 500,   // Maximum response length
    
    // System prompt (defines AI tutor behavior per AI_TUTOR_RULES.md)
    systemPrompt: `You are a patient Python tutor for absolute beginners.

Teaching Rules:
- Ask guiding questions before giving answers
- Encourage reasoning and experimentation
- Never solve homework directly
- Provide hints, not solutions
- Adapt explanations if student is confused
- Use simple, jargon-free language
- Reference specific lessons when relevant
- Celebrate correct thinking
- Point out misconceptions factually

Student Context:
- Absolute beginner (may have zero programming experience)
- Currently learning Python fundamentals
- Has access to lessons 1-10
- Can run Python code in browser
- Homework is validated automatically

Your role: Guide and encourage, never solve for them.`
  },

  /**
   * Voice Narration Configuration (OPTIONAL)
   * Uses browser Web Speech API (free, built-in)
   */
  voice: {
    // Set to true to enable voice narration
    enabled: true,
    
    // Voice settings
    rate: 1.0,    // Speech rate (0.1-10, 1.0 = normal)
    pitch: 1.0,   // Voice pitch (0-2, 1.0 = normal)
    volume: 1.0,  // Volume (0-1, 1.0 = maximum)
    
    // Voice selection (browser-dependent)
    // Leave empty for browser default
    voiceName: '' // e.g., 'Google US English', 'Microsoft David'
  },

  /**
   * Feature Flags
   */
  features: {
    // Show AI tutor chat button (only if ai.enabled is true)
    showAITutor: true,
    
    // Show voice narration controls
    showVoiceControls: true,
    
    // Require homework validation to complete lessons
    requireHomeworkValidation: true,
    
    // Show progress statistics
    showProgress: true
  },

  /**
   * Platform Settings
   */
  platform: {
    // Total lessons available
    totalLessons: 10,
    
    // Lesson storage location
    lessonPath: 'lessons/',
    
    // Progress storage key
    progressStorageKey: 'python-tutor-progress',
    
    // Backend API URL (only used if useBackendProxy is true)
    backendURL: 'https://flexjin.pythonanywhere.com',
    
    // Use backend proxy for AI calls. Set false to call OpenRouter/OpenAI/Anthropic directly from the browser.
    // Set true only if you run your own backend that exposes /api/ai/chat.
    useBackendProxy: true
  }
};

/**
 * Validate configuration
 * Checks if settings are valid and logs warnings
 */
export function validateConfig() {
  const warnings = [];
  
  // Check AI configuration
  // If using backend proxy, we don't need a client-side API key
  const isAIReady = Config.ai.enabled && (Config.ai.apiKey || Config.platform.useBackendProxy);

  if (Config.ai.enabled && !isAIReady) {
    warnings.push('⚠️ AI Tutor enabled but no API key provided and backend proxy is disabled.');
  }
  
  if (isAIReady) {
    console.log('✅ AI Tutor: Enabled');
    if (Config.platform.useBackendProxy) {
      console.log('   Mode: Backend Proxy (Secure)');
    } else {
      console.log(`   Provider: ${Config.ai.provider}`);
    }
  } else {
    console.log('ℹ️ AI Tutor: Disabled');
  }
  
  // Check voice configuration
  if (Config.voice.enabled) {
    console.log('✅ Voice Narration: Enabled (using Web Speech API)');
  } else {
    console.log('ℹ️ Voice Narration: Disabled');
  }
  
  // Log warnings
  if (warnings.length > 0) {
    warnings.forEach(warning => console.warn(warning));
  }
  
  return warnings.length === 0;
}

/**
 * Update configuration at runtime
 * For administrator use
 */
export function updateConfig(updates) {
  Object.assign(Config, updates);
  validateConfig();
  
  // Save to localStorage for persistence
  try {
    localStorage.setItem('python-tutor-config', JSON.stringify(Config));
  } catch (e) {
    console.warn('Could not save config to localStorage:', e);
  }
}

/**
 * Load configuration from localStorage
 */
export function loadConfig() {
  try {
    const saved = localStorage.getItem('python-tutor-config');
    if (saved) {
      const savedConfig = JSON.parse(saved);
      // Merge so new defaults (e.g. useBackendProxy: false) apply when not in saved config
      if (savedConfig.ai) Object.assign(Config.ai, savedConfig.ai);
      if (savedConfig.voice) Object.assign(Config.voice, savedConfig.voice);
      if (savedConfig.features) Object.assign(Config.features, savedConfig.features);
      if (savedConfig.platform) Object.assign(Config.platform, savedConfig.platform);
      console.log('✅ Configuration loaded from storage');
    }
  } catch (e) {
    console.warn('Could not load config from localStorage:', e);
  }
  
  validateConfig();
}

// Auto-load config on import
loadConfig();

