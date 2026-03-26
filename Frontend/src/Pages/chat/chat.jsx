import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './chat.css';

const backendUrl = process.env.VITE_API_URL;

const API_BASE = backendUrl;
const MAIN_API_URL = `${API_BASE}`;

const renderFormattedText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="markdown-content">
      {lines.map((line, blockIndex) => {
        let isHeader = false;
        let headerLevel = null;
        let lineContent = line;

        if (line.startsWith('#### ')) {
          isHeader = true; headerLevel = 4; lineContent = line.substring(5);
        } else if (line.startsWith('### ')) {
          isHeader = true; headerLevel = 3; lineContent = line.substring(4);
        } else if (line.startsWith('## ')) {
          isHeader = true; headerLevel = 2; lineContent = line.substring(3);
        } else if (line.startsWith('# ')) {
          isHeader = true; headerLevel = 1; lineContent = line.substring(2);
        }

        let isList = false;
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          isList = true;
          lineContent = line.substring(line.indexOf(' ') + 1);
        }

        const inlineParts = lineContent.split(/(\*\*.*?\*\*|`.*?`)/g);
        const renderedInline = inlineParts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={i} className="highlight-text">{part.slice(2, -2)}</span>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return <span key={i} className="highlight-code">{part.slice(1, -1)}</span>;
          }
          return <span key={i}>{part}</span>;
        });

        if (line.trim() === '') {
          return <div key={blockIndex} style={{ height: '0.4rem' }} />;
        }

        if (isHeader) {
          const Tag = `h${headerLevel}`;
          return <Tag key={blockIndex} className="markdown-header">{renderedInline}</Tag>;
        }

        if (isList) {
          return (
            <div key={blockIndex} className="markdown-list-item">
              <span>{renderedInline}</span>
            </div>
          );
        }

        return <div key={blockIndex} className="markdown-paragraph">{renderedInline}</div>;
      })}
    </div>
  );
};

const StarCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const stars = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * 0.3 + 0.1,
      opacity: Math.random(),
      fadeSpeed: Math.random() * 0.02 + 0.005,
      fadingOut: Math.random() > 0.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.y -= star.speedY;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        if (star.fadingOut) {
          star.opacity -= star.fadeSpeed;
          if (star.opacity <= 0.1) star.fadingOut = false;
        } else {
          star.opacity += star.fadeSpeed;
          if (star.opacity >= 1) star.fadingOut = true;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
};

const chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation();
  const hasSentAutoQuery = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${RAG_API_URL}/health`);
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
    }
  };

  useEffect(() => {
    if (apiStatus === 'connected' && location.state?.autoQuery && !hasSentAutoQuery.current) {
      hasSentAutoQuery.current = true;
      const query = location.state.autoQuery;
      setInput(query);
      handleSend(query);
      window.history.replaceState({}, document.title);
    }
  }, [apiStatus, location.state?.autoQuery]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    autoResize();
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
    handleSend(promptText);
  };

  const handleSend = async (overrideText) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSend.trim()) return;

    if (apiStatus !== 'connected') {
      alert('RAG API is offline. Please start it on port 8001.');
      return;
    }

    const newMsgArr = [...messages, {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toISOString()
    }];
    setMessages(newMsgArr);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    try {
      const response = await fetch(`${RAG_API_URL}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.answer,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);

      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          await fetch(`${MAIN_API_URL}/gamification/record-interaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, isQuiz: false })
          });
        } catch (e) { }
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble connecting to my knowledge base right now.",
        sender: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <StarCanvas />

      {apiStatus === 'error' && (
        <div className="api-error-banner">
          ⚠️ RAG API offline. Start with: uvicorn src.app.api:app --reload --port 8000
        </div>
      )}

      <header className="chat-header">
        <div className="header-left">
          <img src="/logo.png" alt="Astrosera Logo" className="header-logo" />
          <div className="status-dot"></div>
          <div>
            <h1 className="app-title">Astrosera</h1>
            <span className="app-subtitle">Online • Astronomy AI</span>
          </div>
        </div>
        <button onClick={clearChat} className="clear-chat-btn">
          Clear chat
        </button>
      </header>

      <div className="chat-window">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-2.773l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </div>
            <h2 className="welcome-title">Ask me about space</h2>
            <p className="welcome-subtitle">Astrosera is ready to explore the cosmos with you.</p>
            <div className="quick-prompts">
              {['Universe', 'Black holes', 'Mars', 'Stars', 'Dark matter'].map(p => (
                <button key={p} className="prompt-chip" onClick={() => handleQuickPrompt(p)}>{p} ✨</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-content-wrapper">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="bot-avatar-wrapper">
                    <div className="bot-avatar">
                      <img src="/images/bot-avatar.png" alt="Astrosera" className="bot-avatar-img" />
                    </div>
                  </div>
                )}
                <div className={`message-content ${msg.isError ? 'error' : ''}`}>
                  {msg.sender === 'user' ? (
                    <div className="message-box">{msg.text}</div>
                  ) : (
                    renderFormattedText(msg.text)
                  )}
                  <div className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-row bot">
                <div className="bot-avatar-wrapper">
                  <div className="bot-avatar">
                    <img src="/images/bot-avatar.png" alt="Astrosera" className="bot-avatar-img" />
                  </div>
                </div>
                <div className="message-content">
                  <div className="message-box typing-box">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} style={{ height: '1px' }} />
      </div>

      <div className="input-container-wrapper">
        <div className="input-bar">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask about space, planets, stars, galaxies..."
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isTyping || apiStatus !== 'connected'}
          />
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping || apiStatus !== 'connected'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div className="input-hint">
          Astrosera can make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
};

export default chat;