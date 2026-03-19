import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './chat.css';

<<<<<<< HEAD
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
=======
const RAG_API_URL = 'http://localhost:8000';

const SUGGESTIONS = [
  'What is a black hole and how does it form?',
  'Explain the life cycle of a star',
  'What is the cosmic microwave background?',
  'Astronomy Picture of the Day',
  'Latest Earth Image (EPIC)',
];


const Starfield = () => {
  const canvasRef = useRef(null);

>>>>>>> 22a3232897f379252af51dbe549e806c51805aa4
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
<<<<<<< HEAD
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
=======

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.08 + 0.02,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.005 + 0.002,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.y -= s.speed;
        if (s.y < -2) {
          s.y = canvas.height + 2;
          s.x = Math.random() * canvas.width;
        }

        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
        const alpha = s.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" />;
};


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const [apiStatus, setApiStatus] = useState('checking');
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    checkApiHealth();
>>>>>>> 22a3232897f379252af51dbe549e806c51805aa4
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
<<<<<<< HEAD
      const res = await fetch(`${RAG_API_URL}/health`);
=======
      const res = await fetch(`${RAG_API_URL}/api/health`);
>>>>>>> 22a3232897f379252af51dbe549e806c51805aa4
      setApiStatus(res.ok ? 'connected' : 'error');
    } catch {
      setApiStatus('error');
    }
  };

<<<<<<< HEAD
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
=======
  const handleSend = async (text) => {
    const question = (text || input).trim();
    if (!question) return;

    if (!showChat) setShowChat(true);

    const isApodReq = question.toLowerCase().includes('astronomy picture of the day') || question.toLowerCase() === 'apod';

    if (isApodReq) {
      const userMsg = {
        id: Date.now(),
        text: question,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      try {
        const res = await fetch(`${RAG_API_URL}/apod`);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const data = await res.json();

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            type: 'apod',
            data: data,
            sender: 'bot',
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "I couldn't fetch the Astronomy Picture of the Day from NASA right now. Please try again later.",
            sender: 'bot',
            isError: true,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    const isEpicReq = question.toLowerCase().includes('epic') ||
      question.toLowerCase().includes('earth picture') ||
      question.toLowerCase().includes('earth image');

    if (isEpicReq) {
      const userMsg = {
        id: Date.now(),
        text: question,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      try {
        const res = await fetch(`${RAG_API_URL}/epic`);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const data = await res.json();

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            type: 'epic',
            data: data,
            sender: 'bot',
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "I couldn't fetch the latest EPIC image of Earth from NASA right now. Please try again later.",
            sender: 'bot',
            isError: true,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    const userMsg = {
      id: Date.now(),
      text: question,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
>>>>>>> 22a3232897f379252af51dbe549e806c51805aa4
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const res = await fetch(`${RAG_API_URL}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
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
=======
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: data.answer,
          sender: 'bot',
          citations: data.citations || [],
          timestamp: data.timestamp,
          searchQuery: data.search_query,
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm having trouble connecting to my knowledge base. Please make sure the RAG API is running and try again.",
          sender: 'bot',
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
>>>>>>> 22a3232897f379252af51dbe549e806c51805aa4
    } finally {
      setIsTyping(false);
    }
  };

<<<<<<< HEAD
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

=======
  const handleClearChat = async () => {
    try {
      await fetch(`${RAG_API_URL}/api/session/${sessionId}`, { method: 'DELETE' });
    } catch { }
    setMessages([]);
    setShowChat(false);
  };

  return (
    <div className="astra-root">
      <Starfield />

      {/* ── Nav ── */}
      <nav className="astra-nav">
        <div className="nav-brand">
          <div className="nav-logo">🔭</div>
          <div>
            <div className="nav-title">AstraRAG</div>
            <div className="nav-sub">Astronomy Knowledge System</div>
          </div>
        </div>
        <div className="nav-right">
          {showChat && (
            <button className="clear-btn" onClick={handleClearChat}>
              🗑️ Clear
            </button>
          )}
          <div className={`status-badge ${apiStatus}`}>
            <span className="status-dot" />
            {apiStatus === 'connected' && 'RAG Online'}
            {apiStatus === 'error' && 'API Offline'}
            {apiStatus === 'checking' && 'Checking…'}
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="astra-main">
        {!showChat ? (
          /* Landing */
          <div className="astra-landing">
            <div className="hero-icon">🔭</div>
            <h1 className="hero-title">Explore the Universe</h1>
            <p className="hero-sub">
              Ask anything about astronomy — from black holes to<br />
              galaxy formation, stellar evolution to dark matter. Powered<br />
              by a curated astronomy knowledge base.
            </p>

            <div className="chips-grid">
              {SUGGESTIONS.map((q, i) => (
                <button key={i} className="chip-btn" onClick={() => handleSend(q)}>
                  <span className="chip-icon">✦</span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="chat-window">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`bubble ${msg.sender} ${msg.isError ? 'error' : ''} ${(msg.type === 'apod' || msg.type === 'epic') ? 'apod-bubble' : ''}`}
              >
                {msg.sender === 'bot' && <div className="bot-avatar">🔭</div>}

                <div className="bubble-inner">
                  {msg.type === 'apod' ? (
                    <div className="apod-card">
                      {msg.data.media_type === 'video' ? (
                        <iframe
                          src={msg.data.url}
                          title={msg.data.title}
                          frameBorder="0"
                          allow="encrypted-media"
                          allowFullScreen
                          className="apod-video"
                        />
                      ) : (
                        <img src={msg.data.url} alt={msg.data.title} className="apod-img" />
                      )}
                      <div className="apod-details">
                        <h3 className="apod-title">{msg.data.title}</h3>
                        <div className="apod-meta">
                          {msg.data.date} • {msg.data.copyright || 'Public Domain'}
                        </div>
                        <p className="apod-desc">{msg.data.explanation}</p>
                      </div>
                    </div>
                  ) : msg.type === 'epic' ? (
                    <div className="apod-card">
                      <img src={msg.data.url} alt={msg.data.title} className="apod-img" />
                      <div className="apod-details">
                        <h3 className="apod-title">{msg.data.title}</h3>
                        <div className="apod-meta">
                          {msg.data.date} • NASA EPIC
                        </div>
                        <p className="apod-desc">{msg.data.caption}</p>
                        <p className="apod-meta" style={{ marginTop: '0.5rem' }}>ID: {msg.data.identifier}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="bubble-text">{msg.text}</p>
                  )}

                  {msg.searchQuery && msg.searchQuery !== msg.text && (
                    <div className="search-info">
                      <small>🔍 Searched for: "{msg.searchQuery}"</small>
                    </div>
                  )}

                  {msg.citations?.length > 0 && (
                    <div className="citations">
                      <div className="cit-header">📚 Sources</div>
                      {msg.citations.map((c, i) => (
                        <div key={i} className="source-card">
                          <div className="source-title">{c.title}</div>
                          <div className="source-preview">{c.content_preview}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bubble-timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="typing-bubble">
                <div className="bot-avatar">🔭</div>
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* ── Input Bar ── */}
      <div className="astra-input-bar">
        <div className="input-wrap">
          <input
            className="astra-input"
            type="text"
            placeholder="Ask about stars, galaxies, black holes..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isTyping}
          />
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            ➤
          </button>
        </div>
        <p className="astra-disclaimer">
          AstraRAG may produce inaccuracies. Verify with primary sources.
        </p>
>>>>>>> 22a3232897f379252af51dbe549e806c51805aa4
      </div>
    </div>
  );
};

export default Chat;
