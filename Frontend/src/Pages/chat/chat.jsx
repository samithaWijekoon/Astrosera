import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import { RAG_BASE_URL } from '../../config/apiConfig';

const RAG_API_URL = RAG_BASE_URL;

const QUICK_PROMPTS = [
  { icon: '🪐', text: 'Tell me about Saturn\'s rings' },
  { icon: '🌌', text: 'How big is the Milky Way?' },
  { icon: '⭐', text: 'What is a neutron star?' },
  { icon: '🚀', text: 'How does a black hole form?' },
];

/* Simple markdown-like renderer */
const renderText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (/^\*\*(.+)\*\*$/.test(line)) {
      return <p key={i} className="msg-bold">{line.replace(/\*\*/g, '')}</p>;
    }
    if (/^##\s/.test(line)) {
      return <h3 key={i} className="msg-h2">{line.replace(/^##\s/, '')}</h3>;
    }
    if (/^#\s/.test(line)) {
      return <h2 key={i} className="msg-h1">{line.replace(/^#\s/, '')}</h2>;
    }
    if (/^[-*]\s/.test(line)) {
      return <div key={i} className="msg-li"><span className="msg-bullet">◆</span><span>{line.replace(/^[-*]\s/, '')}</span></div>;
    }
    if (line.trim() === '') return <br key={i} />;
    // inline bold
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="msg-p">
        {parts.map((part, j) =>
          /^\*\*[^*]+\*\*$/.test(part)
            ? <strong key={j}>{part.replace(/\*\*/g, '')}</strong>
            : part
        )}
      </p>
    );
  });
};

/* Animated star background */
const StarField = () => {
  const stars = useRef(
    Array.from({ length: 80 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      opacity: (Math.random() * 0.5 + 0.1).toFixed(2),
      dur: `${(Math.random() * 4 + 2).toFixed(1)}s`,
      delay: `${(Math.random() * 5).toFixed(1)}s`,
    }))
  ).current;
  return (
    <div className="star-field" aria-hidden>
      {stars.map((s, i) => (
        <span key={i} className="star-particle" style={{
          top: s.top, left: s.left,
          width: s.size, height: s.size,
          opacity: s.opacity,
          animationDuration: s.dur,
          animationDelay: s.delay,
        }} />
      ))}
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { checkHealth(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${RAG_API_URL}/health`);
      setApiStatus(res.ok ? 'connected' : 'error');
    } catch {
      setApiStatus('error');
    }
  };

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question) return;
    if (apiStatus !== 'connected') return;

    setMessages(prev => [...prev, { id: Date.now(), text: question, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    inputRef.current?.focus();

    try {
      const res = await fetch(`${RAG_API_URL}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      const citations = data.citations ? Object.values(data.citations) : [];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.answer,
        sender: 'bot',
        citations,
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I encountered a signal disruption. Please verify the RAG system is online and try again.",
        sender: 'bot',
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => setMessages([]);

  const showWelcome = messages.length === 0;

  return (
    <div className="astra-chat">
      <StarField />

      {/* Nebula blobs */}
      <div className="nebula n1" />
      <div className="nebula n2" />

      {/* Header */}
      <header className="astra-header">
        <div className="astra-brand">
          <div className="astra-avatar-wrap">
            <span className="astra-avatar-icon">✦</span>
            <span className="astra-avatar-ring" />
          </div>
          <div>
            <h1 className="astra-title">AstraBot</h1>
            <p className="astra-sub">Powered by RAG · Astronomy Intelligence</p>
          </div>
        </div>

        <div className="astra-header-right">
          <div className={`astra-status status-${apiStatus}`}>
            <span className="astra-status-dot" />
            <span className="astra-status-label">
              {apiStatus === 'connected' ? 'Online' : apiStatus === 'checking' ? 'Connecting…' : 'Offline'}
            </span>
          </div>
          {messages.length > 0 && (
            <button className="astra-clear-btn" onClick={clearChat} title="Clear chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="astra-messages">
        {showWelcome && (
          <div className="astra-welcome">
            <div className="astra-welcome-orb">
              <span className="astra-orb-icon">🌌</span>
              <div className="astra-orb-ring r1" />
              <div className="astra-orb-ring r2" />
            </div>
            <h2 className="astra-welcome-title">Ask the cosmos anything</h2>
            <p className="astra-welcome-sub">
              I'm AstraBot — your AI astronomy guide, powered by a knowledge base of space science.
            </p>

            {apiStatus === 'error' && (
              <div className="astra-offline-badge">
                ⚠️ RAG System offline — start it on port 8001
              </div>
            )}

            <div className="astra-quick-prompts">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  className="astra-prompt-chip"
                  onClick={() => sendMessage(p.text)}
                  disabled={apiStatus !== 'connected'}
                >
                  <span className="chip-icon">{p.icon}</span>
                  <span>{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`astra-msg-row ${msg.sender}`}>
            {msg.sender === 'bot' && (
              <div className="astra-bot-avatar">✦</div>
            )}

            <div className={`astra-bubble ${msg.sender} ${msg.isError ? 'is-error' : ''}`}>
              {msg.sender === 'bot' ? renderText(msg.text) : <p className="msg-p">{msg.text}</p>}

              {msg.citations && msg.citations.length > 0 && (
                <div className="astra-citations">
                  <div className="citations-header">
                    <span>📚</span> Sources
                  </div>
                  <div className="citations-list">
                    {msg.citations.map((c, idx) => (
                      <div key={idx} className="citation-item">
                        <span className="citation-num">{idx + 1}</span>
                        <div>
                          <div className="citation-title">{c.title}</div>
                          {c.content_preview && (
                            <div className="citation-preview">{c.content_preview}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="astra-msg-row bot">
            <div className="astra-bot-avatar">✦</div>
            <div className="astra-bubble bot astra-typing-bubble">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="astra-input-footer">
        <div className="astra-input-wrap">
          <textarea
            ref={inputRef}
            className="astra-textarea"
            rows={1}
            placeholder={apiStatus === 'connected'
              ? "Ask about stars, galaxies, black holes…"
              : "RAG system is offline…"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping || apiStatus !== 'connected'}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
            }}
          />
          <button
            className="astra-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping || apiStatus !== 'connected'}
            title="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="astra-hint">Press Enter to send · Shift+Enter for new line</p>
      </footer>
    </div>
  );
};

export default Chat;