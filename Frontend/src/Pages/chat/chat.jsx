import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './chat.css';

const RAG_API_URL = 'http://localhost:8001';
const MAIN_API_URL = 'http://localhost:5001/api';

const QUICK_PROMPTS = [
  { label: 'Tell me about the Universe', icon: '🌌' },
  { label: 'What is a black hole?', icon: '🕳️' },
  { label: 'Tell me about Mars', icon: '🔴' },
  { label: 'How do stars form?', icon: '⭐' },
  { label: 'What is dark matter?', icon: '🔭' },
];

const StarCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let stars = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        speed: Math.random() * 0.4 + 0.05,
        opacity: Math.random() * 0.7 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() / 1000;
      stars.forEach(s => {
        s.y -= s.speed;
        if (s.y < -2) { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
        const op = s.opacity * (0.6 + 0.4 * Math.sin(t * 1.2 + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init); };
  }, []);

  return <canvas ref={canvasRef} className="star-canvas" />;
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const hasSentAutoQuery = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => { checkApiHealth(); }, []);

  const checkApiHealth = async () => {
    try {
      const res = await fetch(`${RAG_API_URL}/health`);
      setApiStatus(res.ok ? 'connected' : 'error');
    } catch {
      setApiStatus('error');
    }
  };

  useEffect(() => {
    if (apiStatus === 'connected' && location.state?.autoQuery && !hasSentAutoQuery.current) {
      hasSentAutoQuery.current = true;
      handleSend(location.state.autoQuery);
      window.history.replaceState({}, document.title);
    }
  }, [apiStatus, location.state?.autoQuery]);

  const handleSend = async (overrideText) => {
    const text = typeof overrideText === 'string' ? overrideText : input;
    if (!text.trim()) return;
    if (apiStatus !== 'connected') {
      alert('RAG API is not available. Please ensure the API is running on port 8001.');
      return;
    }
    const userMsg = { id: Date.now(), text, sender: 'user', timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const res = await fetch(`${RAG_API_URL}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      const citations = data.citations ? Object.values(data.citations) : [];
      setMessages(prev => [...prev, {
        id: Date.now() + 1, text: data.answer, sender: 'bot',
        citations, timestamp: new Date().toISOString(),
      }]);
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetch(`${MAIN_API_URL}/gamification/record-interaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, isQuiz: false }),
        }).catch(() => {});
      }
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm having trouble reaching the knowledge base. Please make sure the RAG API is running on port 8001.",
        sender: 'bot', isError: true, timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const showWelcome = messages.length === 0;

  const renderMessageText = (text) => {
    if (!text) return { __html: '' };
    // Simple Markdown-like to HTML converter
    let html = text
      .replace(/^### (.*)/gm, '<h3 style="margin-top: 1rem; margin-bottom: 0.5rem; color: #4dc9ff;">$1</h3>') // Headers
      .replace(/<span style="color: (.*?)">### (.*?)<\/span>/g, '<h3 style="margin-top: 1rem; margin-bottom: 0.5rem; color: $1;">$2</h3>') // Colorized Headers
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/^- (.*)/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.25rem;">$1</li>') // Lists
      .replace(/\n/g, '<br />'); // Newlines

    return { __html: html };
  };

  return (
    <div className="chat-root">
      <StarCanvas />
      <div className="chat-shell">

        {/* Top bar */}
        <header className="chat-topbar">
          <div className="chat-brand">
            <span className={`brand-dot ${apiStatus}`} />
            <span className="brand-name">AstraBot</span>
            <span className="brand-tag">astronomy AI</span>
          </div>
          <button className="chat-clear-btn" onClick={() => setMessages([])}>Clear chat</button>
        </header>

        {/* Messages */}
        <div className="chat-messages">
          {showWelcome ? (
            <div className="chat-welcome">
              <div className="welcome-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              </div>
              <h2 className="welcome-title">Ask me about space</h2>
              <p className="welcome-sub">Powered by AstraRAG — your astronomy knowledge base</p>
              <div className="welcome-chips">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} className="chip" onClick={() => handleSend(p.label)}>
                    <span>{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div key={msg.id} className={`msg-row ${msg.sender}`}>
                  {msg.sender === 'bot' && <div className="bot-av">A</div>}
                  <div className="msg-body">
                    <div 
                      className={`msg-text ${msg.isError ? 'error' : ''}`}
                      dangerouslySetInnerHTML={renderMessageText(msg.text)}
                    />
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="msg-sources">
                        <div className="sources-label">Sources</div>
                        {msg.citations.map((c, i) => (
                          <div key={i} className="source-item">
                            <div className="source-title">{c.title}</div>
                            <div className="source-preview">{c.content_preview}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="msg-time">{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="msg-row bot">
                  <div className="bot-av">A</div>
                  <div className="typing-dots"><span /><span /><span /></div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="chat-bar">
          <div className="chat-bar-inner">
            <textarea
              ref={inputRef}
              rows={1}
              className="chat-input"
              placeholder="Ask about space, stars, galaxies…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isTyping || apiStatus !== 'connected'}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isTyping || apiStatus !== 'connected'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div className={`chat-bar-hint ${apiStatus === 'error' ? 'error' : ''}`}>
            {apiStatus === 'error'
              ? '⚠ API offline — run: uvicorn src.app.api:app --reload --port 8001'
              : 'Enter to send · Shift+Enter for new line'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
