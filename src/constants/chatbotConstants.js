// chatbotConstants.js

// AI Configuration
export const AI_CONFIG = {
  model: "gemini-1.5-flash",
  maxOutputTokens: 800,
  temperature: 0.7,
  maxRetries: 3,
  retryDelays: [1000, 2000, 4000], // Exponential backoff delays
  contextMessageLimit: 6, // Number of recent messages for context
};

// Chat Modes
export const CHAT_MODES = {
  DOCUMENT: "document",
  GLOBAL: "global",
};

// Content Thresholds
export const CONTENT_THRESHOLDS = {
  MIN_DOCUMENT_LENGTH: 100,
  UNSUPPORTED_INDICATORS: [
    "could not be fully processed",
    "UNSUPPORTED_FILE_TYPE"
  ],
};

// Prompt Templates
export const PROMPT_TEMPLATES = {
  DOCUMENT_MODE: (documentText, question) => `You are an AI study assistant. You MUST answer ONLY based on the document content provided below.

DOCUMENT CONTENT:
"""
${documentText}
"""

IMPORTANT RULES:
- Answer ONLY from the content above
- If the question cannot be answered from the document, say "I cannot find that specific information in this document"
- Use the exact information and terminology from the document
- For summarization, extract key points directly from the content
- Support multiple languages (Hindi/English/others) if present in the document
- Be helpful but stay strictly within the document boundaries

STUDENT QUESTION: ${question}

ANSWER (based only on the document content above):`,

  GLOBAL_MODE: (conversationContext, question) => `You are a helpful AI learning assistant. Answer questions clearly and educationally.
${conversationContext}
CURRENT QUESTION: ${question}

Please provide a helpful response. If the student refers to "this code", "the code", or similar references from our conversation, use the context above to understand what they're referring to.`,
};

// UI Messages
export const UI_MESSAGES = {
  HEADERS: {
    TITLE: "AI Study Assistant",
    SUBTITLE: "Your personal learning companion",
  },
  
  MODES: {
    DOCUMENT_LABEL: "Document Mode",
    GLOBAL_LABEL: "Global Mode",
  },

  PLACEHOLDERS: {
    DOCUMENT_WITH_CONTENT: "Ask about this document... (e.g., 'Summarize the main points' or 'What does this document say about...')",
    DOCUMENT_LIMITED: "Ask about this document... (Note: Limited text extraction)",
    GLOBAL: "Ask me anything... (e.g., 'Explain photosynthesis simply')",
  },

  STATUS_MESSAGES: {
    DOCUMENT_READY: "💡 Ask questions about this document - I have access to its content and can provide detailed answers!",
    DOCUMENT_LIMITED: "⚠️ Limited document access. I'll do my best to help, but consider switching to Global Mode for better assistance.",
    GLOBAL_READY: "🌍 Ask me anything - I'll help you learn with clear explanations!",
    EMPTY_CHAT_TITLE: "Ready to help you learn!",
    EMPTY_CHAT_DOCUMENT: "Ask questions about this document and get detailed answers based on its content",
    EMPTY_CHAT_DOCUMENT_LIMITED: "Document mode active, but content extraction was limited. Try Global Mode for better help.",
    EMPTY_CHAT_GLOBAL: "Ask me anything and I'll break it down for easy learning",
  },

  BUTTONS: {
    CLEAR_CHAT: "Clear Chat",
    SEND: "Send",
    SENDING: "Sending...",
    COPY_TITLE: "Copy message",
  },

  KEYBOARD_HINTS: {
    ENTER: "Enter",
    SHIFT_ENTER: "Shift + Enter",
    ENTER_DESCRIPTION: "to send",
    SHIFT_ENTER_DESCRIPTION: "for new line",
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  API_KEY_MISSING: "Gemini API key not configured",
  NO_RESPONSE: "No response text received from AI model",
  SERVICE_OVERLOADED: "AI service is temporarily overloaded. Please try again later.",
  GENERAL_ERROR: "Failed to get AI response. Please try again.",
  
  FORMATTED_RESPONSES: {
    SERVICE_OVERLOADED: `⚠️ **Service Temporarily Unavailable**

The AI service is currently experiencing high demand and is temporarily overloaded.

**Please try:**
• Wait 2-3 minutes and try again
• Ask a shorter, simpler question
• Check your internet connection
• Refresh the page if the problem persists

**Tip:** Peak usage times may cause delays. Try again in a few minutes for better response times!`,

    GENERAL_ERROR: `❌ **Error Getting Response**

Sorry, I encountered an error while processing your question.

**Please check:**
• Your internet connection
• Try rephrasing your question
• Refresh the page if the problem continues

**If the problem persists**, there may be a temporary issue with the AI service.`,
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MESSAGE_COPIED: "Message copied!",
  CHAT_CLEARED: "Chat cleared!",
};

// Retry Messages
export const RETRY_MESSAGES = {
  RETRYING: (current, max) => `AI service busy, retrying... (${current}/${max})`,
};

// Toast Messages
export const TOAST_MESSAGES = {
  SERVICE_OVERLOADED: "AI service overloaded. Please try again in a few minutes.",
  RESPONSE_ERROR: "Failed to get AI response",
};

// CSS Classes and Styles
export const STYLES = {
  GRADIENTS: {
    MAIN_CONTAINER: "from-blue-50 to-indigo-100",
    HEADER: "from-blue-600 to-indigo-600",
    USER_MESSAGE: "from-blue-500 to-blue-600",
    AI_AVATAR: "from-green-500 to-green-600",
    USER_AVATAR: "from-blue-500 to-blue-600",
    SEND_BUTTON: "from-blue-500 to-indigo-600",
    SEND_BUTTON_HOVER: "from-blue-600 to-indigo-700",
    BOT_ICON_BG: "from-blue-100 to-indigo-100",
  },
  
  ANIMATIONS: {
    BOUNCE_DELAY_1: "0.1s",
    BOUNCE_DELAY_2: "0.2s",
  },
};

// Message Roles
export const MESSAGE_ROLES = {
  USER: "user",
  AI: "ai",
};

export const PREVIEW_TEXT_LIMIT = 20000;
