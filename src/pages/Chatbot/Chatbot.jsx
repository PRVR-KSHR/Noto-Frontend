import React, { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import {
  Send,
  Bot,
  FileText,
  Globe,
  User,
  Copy,
  AlertTriangle,
} from "lucide-react";

const Chatbot = ({ documentText, initialMode = "document", disableDocumentMode = false }) => {
  const [mode, setMode] = useState(initialMode);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const groqClient = useRef(null);
  const geminiClient = useRef(null);
  const endRef = useRef(null);

  // Debug logging for document text
  useEffect(() => {
    console.log("🤖 Chatbot initialized with:");
    console.log("Document Text Length:", documentText?.length || 0);
    console.log("Current Mode:", mode);
  }, [documentText, mode]);

  const MARKDOWN_COMPONENTS = {
    h1: ({ node, ...props }) => (
      <h1
        className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2"
        {...props}
      />
    ),
    h2: ({ node, ...props }) => (
      <h2
        className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2"
        {...props}
      />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1"
        {...props}
      />
    ),
    p: ({ node, ...props }) => (
      <p
        className="text-gray-700 dark:text-gray-200 mb-2 leading-relaxed"
        {...props}
      />
    ),
    ul: ({ node, ...props }) => (
      <ul
        className="list-disc list-inside text-gray-700 dark:text-gray-200 mb-2 space-y-1"
        {...props}
      />
    ),
    ol: ({ node, ...props }) => (
      <ol
        className="list-decimal list-inside text-gray-700 dark:text-gray-200 mb-2 space-y-1"
        {...props}
      />
    ),
    li: ({ node, ...props }) => (
      <li className="text-gray-700 dark:text-gray-200" {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong
        className="font-semibold text-gray-800 dark:text-gray-100"
        {...props}
      />
    ),
    code: ({ node, ...props }) => (
      <code
        className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 px-2 py-1 rounded text-sm font-mono"
        {...props}
      />
    ),
  };

  useEffect(() => {
    let hasValidAPI = false;
    
    // Initialize Groq client
    if (import.meta.env.VITE_GROQ_API_KEY) {
      const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!groqApiKey.startsWith("gsk_")) {
        console.warn("Groq API key format may be incorrect. Expected format: gsk_...");
      } else {
        groqClient.current = new Groq({
          apiKey: groqApiKey,
          dangerouslyAllowBrowser: true
        });
        console.log("✅ Groq API initialized successfully");
        hasValidAPI = true;
      }
    } else {
      console.warn("⚠️ VITE_GROQ_API_KEY not found");
    }
    
    // Initialize Gemini client
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!geminiApiKey.startsWith("AIza") || geminiApiKey.length !== 39) {
        console.warn("Gemini API key format may be incorrect. Expected format: AIzaXXXX... (39 characters)");
      } else {
        try {
          geminiClient.current = new GoogleGenerativeAI(geminiApiKey);
          console.log("✅ Gemini API initialized successfully");
          hasValidAPI = true;
        } catch (initError) {
          console.error("❌ Failed to initialize Gemini client:", initError);
          geminiClient.current = null;
        }
      }
    } else {
      console.warn("⚠️ VITE_GEMINI_API_KEY not found");
    }
    
    if (!hasValidAPI) {
      setError("No valid API keys configured. Please check your Groq and/or Gemini API keys.");
    }
  }, []);

  useEffect(() => {
    // Only scroll within the chat container, not the entire page
    if (endRef.current) {
      const chatContainer = endRef.current.closest('.overflow-y-auto');
      if (chatContainer) {
        // Scroll the chat container to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
      } else {
        // Fallback: scroll within the visible area only
        endRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "nearest",
          inline: "nearest" 
        });
      }
    }
  }, [chatHistory]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Simple model selection - always use Groq
  const selectAIProvider = () => {
    console.log(`🤖 Using Groq for ${mode} mode`);
    return "groq";
  };

  // Groq API call function
  const callGroqAPI = async (promptText, retryCount = 0) => {
    const modelNames = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant", 
      "mixtral-8x7b-32768",
      "gemma2-9b-it"
    ];
    
    const modelName = modelNames[retryCount % modelNames.length];
    console.log(`🚀 Using Groq model: ${modelName}`);
    
    const messages = [{ role: "user", content: promptText }];
    
    const result = await groqClient.current.chat.completions.create({
      messages: messages,
      model: modelName,
      max_tokens: 800,
      temperature: 0.7,
    });
    
    return result.choices[0]?.message?.content || "";
  };

  // Gemini API call function
  const callGeminiAPI = async (promptText, retryCount = 0) => {
    // Try different model naming conventions
    const modelNames = [
      "gemini-1.5-flash",
      "models/gemini-1.5-flash", 
      "gemini-pro",
      "models/gemini-pro"
    ];
    
    const modelName = modelNames[retryCount % modelNames.length];
    console.log(`🧠 Using Gemini model: ${modelName}`);
    
    const model = geminiClient.current.getGenerativeModel({
      model: modelName,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });
    
    const result = await model.generateContent(promptText);
    let responseText = "";
    
    if (result?.response?.candidates && result.response.candidates.length > 0) {
      const candidate = result.response.candidates[0];
      if (candidate.content?.parts && candidate.content.parts.length > 0) {
        responseText = candidate.content.parts.map(part => part.text).join("");
      }
    }
    
    if (!responseText && result?.response && typeof result.response.text === "function") {
      responseText = await result.response.text();
    }
    
    return responseText;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
      id: Date.now(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    const question = input;
    setInput("");
    setLoading(true);
    setError(null);

    // Smart AI provider selection
    const selectedProvider = selectAIProvider();
    console.log(`🧠 Selected AI Provider: ${selectedProvider} (Mode: ${mode})`);
    
    // Prepare the prompt based on the current mode (moved to higher scope)
    let promptText = "";
    if (mode === "document") {
      console.log("Document mode - documentText length:", documentText?.length || 0);
      console.log("Document text preview:", documentText?.substring(0, 200) + "...");
      
      if (!documentText || documentText.trim().length === 0) {
        setError("No document content available. Please make sure a document is loaded and text has been extracted.");
        setLoading(false);
        return;
      }
      
      // Handle typed documents only
      if (documentText.includes('This is a Microsoft Word document') || 
          documentText.includes('This is a Microsoft PowerPoint') ||
          documentText.includes('The AI can help you with this document by') ||
          documentText.includes('This document couldn\'t be processed for text extraction') ||
          documentText.includes('Please describe the content of your document') ||
          documentText.includes('EXTRACTION_FAILED:') ||
          (documentText.startsWith('Document:') && documentText.includes('The AI can help you with this document by'))) {
        // Handle documents where text extraction failed or isn't available
        promptText = `You are an AI study assistant helping with a document: ${documentText.split('\n')[0] || 'Unknown Document'}

DOCUMENT CONTEXT:
${documentText}

The student is asking: "${question}"

Since the full document text isn't available, provide helpful study assistance by:
- Offering general study strategies for this type of document
- Providing subject-specific guidance if you can infer the topic
- Suggesting how to approach the document for studying
- Creating study plans or note-taking strategies

Be helpful and educational while acknowledging the document type and limitations.

STUDENT QUESTION: ${question}

Please provide helpful study assistance:`;
      } else {
        // Handle documents with successfully extracted text
        promptText = `You are an AI study assistant. You MUST answer ONLY based on the document content provided below.

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

ANSWER (based only on the document content above):`;
      }
    } else {
      // Global mode - conversation context
      let conversationContext = "";
      if (chatHistory.length > 0) {
        const recentMessages = chatHistory.slice(-6);
        conversationContext = "\n\nRECENT CONVERSATION CONTEXT:\n";
        recentMessages.forEach((msg) => {
          conversationContext += `${
            msg.role === "user" ? "Student" : "AI"
          }: ${msg.content}\n`;
        });
        conversationContext += "\n";
      }

      promptText = `You are a helpful AI learning assistant. Answer questions clearly and educationally.
${conversationContext}
CURRENT QUESTION: ${question}

Please provide a helpful response. If the student refers to "this code", "the code", or similar references from our conversation, use the context above to understand what they're referring to.`;
    }
    
    // Retry logic with exponential backoff
    let retries = 0;
    const maxRetries = 3;
    let currentModelIndex = 0;

    while (retries <= maxRetries) {
      try {

        // Call the appropriate API based on selection
        let responseText = "";
        
        if (selectedProvider === "groq" && groqClient.current) {
          responseText = await callGroqAPI(promptText, currentModelIndex);
        } else if (selectedProvider === "gemini" && geminiClient.current) {
          responseText = await callGeminiAPI(promptText, currentModelIndex);
        } else {
          throw new Error(`Selected provider ${selectedProvider} is not available`);
        }

        // ✅ ERROR CHECK: Ensure we have response text
        if (!responseText) {
          throw new Error(`No response text received from ${selectedProvider} API`);
        }

        const aiMessage = {
          role: "ai",
          content: responseText,
          timestamp: new Date(),
          id: Date.now() + 1,
        };

        setChatHistory((prev) => [...prev, aiMessage]);
        setLoading(false);
        break; // Success, exit retry loop
        
      } catch (error) {
        console.error(`${selectedProvider.toUpperCase()} Error (attempt ${retries + 1}):`, error);
        
        // ✅ ENHANCED: Check for specific error types
        const errorMessage = error.message?.toLowerCase() || '';
        const errorStatus = error.status || error.response?.status;
        
        // Check for rate limiting errors (429)
        if (errorStatus === 429 || errorMessage.includes('rate limit') || errorMessage.includes('quota exceeded')) {
          const limitErrorMsg = {
            role: "ai",
            content: `⚠️ **API Rate Limit Reached**

The ${selectedProvider.toUpperCase()} AI service has reached its free tier rate limit.

**What this means:**
• The AI service has a limit on how many requests can be made per minute/hour
• This limit has been temporarily exceeded

**What you can do:**
1. **Wait 1-2 minutes** before asking another question
2. **Try refreshing the page** to reset the connection
3. **Simplify your question** to use fewer AI resources
4. **Come back in an hour** when the rate limit resets

💡 **Tip:** The free tier has daily/hourly limits. Try spacing out your questions for better availability.

🔄 **Status:** Please wait a moment and try again.`,
            timestamp: new Date(),
            id: Date.now() + 1,
          };
          setChatHistory((prev) => [...prev, limitErrorMsg]);
          setError(`${selectedProvider.toUpperCase()} rate limit reached. Please wait before trying again.`);
          toast.error("Rate limit reached. Please wait a moment before trying again.", { duration: 5000 });
          setLoading(false);
          break;
        }
        
        // Check for OCR.space specific errors
        if (errorMessage.includes('ocr') && (errorMessage.includes('limit') || errorMessage.includes('quota'))) {
          const ocrErrorMsg = {
            role: "ai",
            content: `⚠️ **OCR Service Limit Reached**

The handwritten text extraction service (OCR.space) has reached its daily limit.

**Free Tier Limits:**
• 25,000 requests per month
• 500 requests per day

**What happened:**
This document requires OCR (Optical Character Recognition) to extract handwritten text, but the daily limit has been reached.

**Solutions:**
1. **Wait until tomorrow** when the daily limit resets
2. **Try a typed/printed document** instead (doesn't need OCR)
3. **Upload a smaller document** if you have one

💡 **Tip:** OCR is only needed for handwritten documents. Typed PDFs work without using the OCR quota.

📅 **Limit resets:** Daily at midnight UTC`,
            timestamp: new Date(),
            id: Date.now() + 1,
          };
          setChatHistory((prev) => [...prev, ocrErrorMsg]);
          setError("OCR service daily limit reached. Try typed documents or wait until tomorrow.");
          toast.error("OCR daily limit reached. Try a typed document instead.", { duration: 5000 });
          setLoading(false);
          break;
        }
        
        // Check for authentication/API key errors (401, 403)
        if (errorStatus === 401 || errorStatus === 403 || errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
          const authErrorMsg = {
            role: "ai",
            content: `🔐 **API Authentication Error**

There's an issue with the ${selectedProvider.toUpperCase()} API authentication.

**Possible causes:**
• API key has expired or is invalid
• API key doesn't have proper permissions
• API service is temporarily unavailable

**What you can do:**
1. **Refresh the page** and try again
2. **Try again in a few minutes** - this may be temporary
3. **Contact support** if the issue persists

⚠️ **Note:** This is a configuration issue that requires administrator attention.

🔄 **Please try refreshing the page first.**`,
            timestamp: new Date(),
            id: Date.now() + 1,
          };
          setChatHistory((prev) => [...prev, authErrorMsg]);
          setError("API authentication error. Please refresh the page.");
          toast.error("Authentication error. Please refresh the page.", { duration: 5000 });
          setLoading(false);
          break;
        }
        
        // If it's a model not found/decommissioned error, try the next model
        if (error.message?.includes("404") || error.message?.includes("not found") || 
            error.message?.includes("decommissioned") || error.message?.includes("model_decommissioned")) {
          currentModelIndex++;
          if (currentModelIndex < 4) { // Try up to 4 different models for the current provider
            console.log(`Model not available, trying next model...`);
            continue; // Try next model without incrementing retries
          } else if (retries === 0) {
            // If all models for current provider failed, try the other provider
            console.log(`All ${selectedProvider} models failed, trying fallback provider...`);
            const fallbackProvider = selectedProvider === "gemini" ? "groq" : "gemini";
            
            if ((fallbackProvider === "groq" && groqClient.current) || 
                (fallbackProvider === "gemini" && geminiClient.current)) {
              try {
                let responseText = "";
                if (fallbackProvider === "groq") {
                  responseText = await callGroqAPI(promptText, 0);
                } else {
                  responseText = await callGeminiAPI(promptText, 0);
                }
                
                if (responseText) {
                  console.log(`✅ Fallback to ${fallbackProvider} successful`);
                  const aiMessage = {
                    role: "ai",
                    content: `🔄 **Switched to ${fallbackProvider.toUpperCase()} AI**\n\n${responseText}`,
                    timestamp: new Date(),
                    id: Date.now() + 1,
                  };
                  setChatHistory((prev) => [...prev, aiMessage]);
                  setLoading(false);
                  return; // Success with fallback
                }
              } catch (fallbackError) {
                console.error(`Fallback to ${fallbackProvider} also failed:`, fallbackError);
              }
            }
          }
        }
        
        retries++;

        if (
          error.message?.includes("503") ||
          error.message?.includes("overloaded") ||
          error.message?.includes("Service Unavailable")
        ) {
          if (retries <= maxRetries) {
            const waitTime = 1000 * Math.pow(2, retries - 1);
            toast.loading(
              `AI service busy, retrying in ${waitTime/1000}s... (${retries}/${maxRetries})`,
              { duration: 2000 }
            );
            await sleep(waitTime);
            continue;
          } else {
            const errorMessage = {
              role: "ai",
              content: `⚠️ **Service Temporarily Overloaded**

The ${selectedProvider.toUpperCase()} AI service is currently experiencing high demand (Error 503).

**What this means:**
The AI servers are handling too many requests right now and cannot process your question immediately.

**What you can do:**
1. **Wait 2-3 minutes** and try asking your question again
2. **Refresh the page** to establish a new connection
3. **Try a shorter/simpler question** which uses fewer resources
4. **Switch modes** if needed (Document ↔ Global)

**Current Status:** Made ${retries} retry attempts. The service should be available again shortly.

💡 **Tip:** Peak usage times may cause delays. Try again in a few minutes for better response times!

🔄 **Please refresh the page and try again.**`,
              timestamp: new Date(),
              id: Date.now() + 1,
            };
            setChatHistory((prev) => [...prev, errorMessage]);
            setError(
              `${selectedProvider.toUpperCase()} AI service is temporarily overloaded. Please try again in 2-3 minutes.`
            );
            toast.error(
              "AI service overloaded. Please refresh and try again in a moment.",
              { duration: 5000 }
            );
            break;
          }
        } else {
          // ✅ ENHANCED: More detailed error messages
          let errorContent = `❌ **Unable to Process Your Request**

I encountered an unexpected error while trying to answer your question.

**Quick Fixes to Try:**
1. **Refresh the page** (Ctrl+R or Cmd+R) and try again
2. **Check your internet connection** - make sure you're online
3. **Rephrase your question** - try asking in a different way
4. **Try a simpler question** first to test the connection

**If the problem persists:**
• Wait 5-10 minutes and try again
• The AI service may be temporarily unavailable
• There might be maintenance or updates in progress`;

          // Add specific error information for debugging
          if (error.message?.includes("404") || error.message?.includes("not found")) {
            errorContent += `\n\n⚙️ **Technical Issue:** AI model configuration error. The requested model is not available. Please refresh the page.`;
          } else if (error.message?.includes("decommissioned") || error.message?.includes("model_decommissioned")) {
            errorContent += `\n\n⚙️ **Technical Issue:** The AI model has been retired. All backup models have been attempted. Please refresh the page to use updated models.`;
          } else if (error.message?.includes("403") || error.message?.includes("API key") || error.message?.includes("401")) {
            errorContent += `\n\n🔐 **Authentication Issue:** There's a problem with the API credentials. Please refresh the page or contact support if this continues.`;
          } else if (error.message?.includes("timeout") || error.message?.includes("timed out")) {
            errorContent += `\n\n⏱️ **Timeout Error:** The request took too long to process. Try a shorter question or refresh the page.`;
          } else if (error.message?.includes("network") || error.message?.includes("fetch failed")) {
            errorContent += `\n\n🌐 **Connection Error:** Unable to reach the AI service. Please check your internet connection and try again.`;
          } else if (error.message) {
            errorContent += `\n\n🔍 **Error Details:** ${error.message}`;
          }

          errorContent += `\n\n🆘 **Still Having Issues?**
Try refreshing the page first. If problems continue, the service may be temporarily unavailable. Please try again in a few minutes.`;

          const errorMessage = {
            role: "ai",
            content: errorContent,
            timestamp: new Date(),
            id: Date.now() + 1,
          };
          setChatHistory((prev) => [...prev, errorMessage]);
          setError("Failed to get AI response. Please refresh the page and try again.");
          toast.error("Error getting AI response. Please refresh the page.", { duration: 5000 });
          break;
        }
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied!");
  };

  const clearChat = () => {
    setChatHistory([]);
    setError(null);
    toast.success("Chat cleared!");
  };

  // Check if document has meaningful content
  const hasDocumentContent =
    documentText &&
    documentText.length > 100 &&
    !documentText.includes("could not be fully processed") &&
    !documentText.includes("UNSUPPORTED_FILE_TYPE");

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white bg-opacity-20 rounded-full p-1">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold">
                AI Study Assistant
              </h3>
              <p className="text-blue-100 text-xs hidden sm:block">
                Learning companion
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs transition-all"
          >
            Clear
          </button>
        </div>

        {/* Compact Mode Toggle */}
        <div className="flex space-x-1 mt-2 sm:mt-3">
          <button
            onClick={() => {
              if (disableDocumentMode) return;
              setMode("document");
            }}
            disabled={disableDocumentMode}
            title={disableDocumentMode ? "Docs mode is unavailable for this file. Please use Global." : "Ask about this document"}
            className={`flex items-center px-2 py-1 rounded text-xs font-medium transition-all ${
              mode === "document"
                ? "bg-white text-blue-600 shadow-sm"
                : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
            } ${disableDocumentMode ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <FileText className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Doc</span>
          </button>
          <button
            onClick={() => setMode("global")}
            className={`flex items-center px-2 py-1 rounded text-xs font-medium transition-all ${
              mode === "global"
                ? "bg-white text-indigo-600 shadow-sm"
                : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
            }`}
          >
            <Globe className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Global</span>
          </button>
        </div>

        <div className="mt-2 text-blue-100 text-xs">
          {mode === "document" ? (
            disableDocumentMode ? (
              <p>
                ⚠️ <span className="hidden sm:inline">Docs mode not available for this file. Use Global mode.</span>
                <span className="sm:hidden">Docs mode unavailable</span>
              </p>
            ) : hasDocumentContent ? (
              <p>
                💡 <span className="hidden sm:inline">Ask about this document</span>
                <span className="sm:hidden">Ask questions</span>
              </p>
            ) : (
              <p>
                ⚠️ <span className="hidden sm:inline">Limited document access</span>
                <span className="sm:hidden">Limited access</span>
              </p>
            )
          ) : (
            <p>
              🌍 <span className="hidden sm:inline">Ask me anything</span>
              <span className="sm:hidden">Ask anything</span>
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-2 bg-red-500 bg-opacity-20 border border-red-300 rounded p-2 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="text-xs truncate">{error}</span>
          </div>
        )}
      </div>

  {/* Chat Messages */}
  <div className="flex-1 overflow-y-auto p-2 sm:p-3 bg-gray-50 dark:bg-gray-950 min-h-0 transition-colors duration-300">
        {chatHistory.length === 0 ? (
          <div className="text-center py-4 sm:py-6">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Ready to help!
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 px-2">
              {mode === "document"
                ? hasDocumentContent
                  ? "Ask questions about this document"
                  : "Limited document access. Try Global Mode."
                : "Ask me anything and I'll help you learn"}
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] sm:max-w-[90%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 ${
                      message.role === "user" ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : "bg-gradient-to-br from-green-500 to-green-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      ) : (
                        <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div
                    className={`rounded-lg px-2 sm:px-3 py-2 shadow-sm text-xs transition-colors duration-300 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                    }`}
                  >
                    {message.role === "ai" ? (
                      <div className="prose prose-xs max-w-none">
                        <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-white text-xs">{message.content}</p>
                    )}

                    {/* Message Actions */}
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs ${
                          message.role === "user"
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </span>

                      {message.role === "ai" && (
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          title="Copy message"
                        >
                          <Copy className="w-2.5 h-2.5 text-gray-500 dark:text-gray-300" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Animation */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="flex-shrink-0 mr-1 sm:mr-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 sm:px-3 py-2 shadow-sm transition-colors duration-300">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

  {/* Input Area (sticky within Chatbot container) */}
  <div className="p-2 sm:p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 sticky bottom-0 transition-colors duration-300">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex space-x-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "document"
                ? disableDocumentMode
                  ? "Docs mode unavailable for this file. Switch to Global to chat..."
                  : hasDocumentContent
                    ? "Ask about this document..."
                    : "Ask about document (limited)..."
                : "Ask me anything..."
            }
            className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none text-xs bg-white dark:bg-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors duration-300"
            rows={window.innerWidth < 640 ? 1 : 2}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 sm:px-3 py-2 rounded-lg font-medium transition-all flex items-center space-x-1 shadow-sm text-xs flex-shrink-0"
          >
            <Send className="w-3 h-3" />
            <span className="hidden sm:inline">{loading ? "..." : "Send"}</span>
          </button>
        </form>

        <div className="mt-1 sm:mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press{" "}
            <kbd className="bg-gray-200 px-1 py-0.5 rounded text-xs">Enter</kbd>{" "}
            to send
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
