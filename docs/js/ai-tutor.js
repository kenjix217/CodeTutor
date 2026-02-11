/**
 * AI Tutor Module
 * Optional AI-powered tutoring following AI_TUTOR_RULES.md
 * 
 * IMPORTANT: This is an OPTIONAL feature.
 * - Platform works 100% without it
 * - Requires API key (admin configurable)
 * - Designed for future free/paid tier separation
 */

import { Config } from './config.js?v=44';

export class AITutor {
  constructor() {
    this.conversationHistory = [];
    this.currentLesson = null;
    this.isProcessing = false;
  }

  /**
   * Check if AI tutor is available
   */
  isAvailable() {
    // If using backend proxy, we only need AI enabled (backend has the key)
    if (Config.platform.useBackendProxy) {
      return Config.ai.enabled;
    }
    // Otherwise need client-side API key
    return Config.ai.enabled && Config.ai.apiKey && Config.ai.apiKey.trim() !== '';
  }

  /**
   * Set current lesson context
   */
  setLessonContext(lessonId, lessonTitle) {
    this.currentLesson = { id: lessonId, title: lessonTitle };
    
    // Add lesson context to conversation
    this.conversationHistory = [{
      role: 'system',
      content: `${Config.ai.systemPrompt}\n\nCurrent Lesson: ${lessonTitle} (${lessonId})`
    }];
  }

  /**
   * Send message to AI tutor
   * @param {string} userMessage - Student's question
   * @returns {Promise<string>} AI tutor's response
   */
  async chat(userMessage) {
    if (!this.isAvailable()) {
      return "AI Tutor is not configured. The platform works great without it! Continue learning with the lessons.";
    }

    if (this.isProcessing) {
      return "Please wait for the current response to complete.";
    }

    try {
      this.isProcessing = true;

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Get AI response based on provider
      const response = await this.callAIProvider();

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response
      });

      this.isProcessing = false;
      return response;

    } catch (error) {
      this.isProcessing = false;
      console.error('AI Tutor error:', error);
      return `I'm having trouble connecting right now. But don't worry - you can continue learning with the lessons and homework validation! Error: ${error.message}`;
    }
  }

  /**
   * Call AI provider API
   * Uses backend proxy if enabled (solves CORS, secures keys)
   */
  async callAIProvider() {
    // If backend proxy enabled, use it (recommended for production)
    if (Config.platform.useBackendProxy) {
      return await this.callBackendProxy();
    }
    
    // Otherwise call provider directly (has CORS issues with internal APIs)
    const provider = Config.ai.provider.toLowerCase();

    switch (provider) {
      case 'openrouter':
        return await this.callOpenRouter();
      
      case 'openai':
        return await this.callOpenAI();
      
      case 'anthropic':
        return await this.callAnthropic();
      
      case 'custom':
        return await this.callCustomEndpoint();
      
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  }

  /**
   * Call backend proxy (solves CORS, prepares for SaaS)
   */
  async callBackendProxy() {
    let response;
    try {
      response = await fetch(`${Config.platform.backendURL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: this.conversationHistory[this.conversationHistory.length - 1].content,
          lesson_id: this.currentLesson?.id,
          conversation_history: this.conversationHistory,
          provider: Config.ai.provider,
          api_key: Config.ai.apiKey,
          model: Config.ai.model,
          custom_endpoint: Config.ai.customEndpoint
        })
      });
    } catch (networkError) {
      throw new Error(
        `Could not reach the backend server at ${Config.platform.backendURL}. ` +
        'If you are not running your own backend, go to Settings and uncheck "Use backend proxy" to call the AI API directly from your browser.'
      );
    }

    if (!response.ok) {
      let message = `Backend error (${response.status})`;
      try {
        const body = await response.json();
        message = body.detail || body.message || message;
      } catch (_) {
        const text = await response.text();
        if (text) message = text.slice(0, 200);
      }
      throw new Error(message);
    }

    const data = await response.json();
    return data.response;
  }

  /**
   * OpenRouter API implementation
   */
  async callOpenRouter() {
    const model = (Config.ai.model && Config.ai.model.trim()) || 'meta-llama/llama-3.2-3b-instruct:free';
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Config.ai.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Python AI Tutor'
      },
      body: JSON.stringify({
        model,
        messages: this.conversationHistory,
        temperature: Config.ai.temperature,
        max_tokens: Config.ai.maxTokens
      })
    });

    if (!response.ok) {
      let message = 'OpenRouter API request failed';
      try {
        const body = await response.json();
        message = body.error?.message || body.message || message;
      } catch (_) {
        const text = await response.text();
        if (text) message = text.slice(0, 200);
      }
      throw new Error(message);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (content == null) {
      throw new Error('Unexpected API response format');
    }
    return content;
  }

  /**
   * OpenAI API implementation
   */
  async callOpenAI() {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Config.ai.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: Config.ai.model || 'gpt-3.5-turbo',
        messages: this.conversationHistory,
        temperature: Config.ai.temperature,
        max_tokens: Config.ai.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Anthropic (Claude) API implementation
   */
  async callAnthropic() {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Config.ai.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: Config.ai.model || 'claude-3-haiku-20240307',
        max_tokens: Config.ai.maxTokens,
        messages: this.conversationHistory.filter(m => m.role !== 'system'),
        system: Config.ai.systemPrompt
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * Custom endpoint implementation
   */
  async callCustomEndpoint() {
    const response = await fetch(Config.ai.customEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Config.ai.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: this.conversationHistory,
        temperature: Config.ai.temperature,
        max_tokens: Config.ai.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status}`);
    }

    const data = await response.json();
    // Assume OpenAI-compatible format
    return data.choices?.[0]?.message?.content || data.response || 'No response';
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = this.conversationHistory.filter(m => m.role === 'system');
  }

  /**
   * Get conversation summary for display
   */
  getConversationHistory() {
    return this.conversationHistory.filter(m => m.role !== 'system');
  }
}

