import React, { useState, useEffect, useRef } from 'react';
import './chat.css';

// API Configuration
const RAG_API_URL = 'http://localhost:8000';


const chat = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I am AstraBot, your AI astronomy assistant. Ask me anything about the cosmos!", 
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [apiStatus, setApiStatus] = useState('checking'); // checking, connected, error
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${RAG_API_URL}/api/health`);
      if (response.ok) {
        const data = await response.json();
        console.log('API Health:', data);
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      console.error('API Health Check Failed:', error);
      setApiStatus('error');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Check API status
    if (apiStatus !== 'connected') {
      alert('RAG API is not available. Please ensure the API is running on port 8000.');
      return;
    }

    // User message
    const userMsg = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    const currentQuestion = input;
    setInput("");
    setIsTyping(true);

    try {
      // Call RAG API
      const response = await fetch(`${RAG_API_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
          session_id: sessionId,
          use_history: true
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Bot response with citations
      const botMsg = { 
        id: Date.now() + 1, 
        text: data.answer, 
        sender: 'bot',
        citations: data.citations || [],
        timestamp: data.timestamp,
        searchQuery: data.search_query
      };
      
      setMessages(prev => [...prev, botMsg]);
      
    } catch (error) {
      console.error('Error querying RAG:', error);
      
      // Error message
      const errorMsg = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please make sure the RAG API is running and try again.",
        sender: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await fetch(`${RAG_API_URL}/api/session/${sessionId}`, {
        method: 'DELETE'
      });
      
      setMessages([
        { 
          id: Date.now(), 
          text: "Chat history cleared! I'm ready for new questions.", 
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div>
          <h1>AstraBot 🌟</h1>
          <p>Your AI Astronomy Assistant</p>
        </div>
        <div className="header-controls">
          <div className={`api-status ${apiStatus}`}>
            <span className="status-dot"></span>
            {apiStatus === 'connected' && 'Connected'}
            {apiStatus === 'checking' && 'Checking...'}
            {apiStatus === 'error' && 'API Offline'}
          </div>
          <button onClick={handleClearChat} className="clear-btn" title="Clear Chat">
            🗑️ Clear
          </button>
        </div>
      </header>

      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.sender} ${msg.isError ? 'error' : ''}`}>
            <div className="message-content">
              <p>{msg.text}</p>
              
              {msg.searchQuery && msg.searchQuery !== msg.text && (
                <div className="search-query-info">
                  <small>🔍 Searched for: "{msg.searchQuery}"</small>
                </div>
              )}
              
              {msg.citations && msg.citations.length > 0 && (
                <div className="citation-container">
                  <div className="citation-header">📚 Sources:</div>
                  {msg.citations.map((cite, idx) => (
                    <div key={idx} className="source-card">
                      <div className="source-title">{cite.title}</div>
                      <div className="source-preview">{cite.content_preview}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">AstraBot is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <button 
          className="voice-input-btn" 
          title="Voice Input (Coming Soon)"
          disabled
        >
          🎤
        </button>
        <input 
          type="text" 
          placeholder="Ask about space, planets, stars, galaxies..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isTyping || apiStatus !== 'connected'}
        />
        <button 
          className="send-btn" 
          onClick={handleSend}
          disabled={!input.trim() || isTyping || apiStatus !== 'connected'}
        >
          {isTyping ? '...' : 'Send'}
        </button>
      </div>

      {apiStatus === 'error' && (
        <div className="api-error-banner">
          ⚠️ RAG API is not running. Start it with: <code>cd rag_system && python app.py</code>
        </div>
      )}
    </div>
  );
};

export default chat;