import React, { useState, useEffect } from 'react';
import './member1.css';

// Member 01: Intelligent Chatbot & RAG Engine (AstraBot)
const Member1 = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am AstraBot. Ask me anything about the cosmos.", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // User message
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate Bot Response with Streaming effect
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        text: "This is a simulated response based on NASA data. (RAG Logic would be here)",
        sender: 'bot',
        citations: [
          { title: "NASA Mars Mission", url: "https://mars.nasa.gov" },
          { title: "Hubble Space Telescope", url: "https://hubblesite.org" }
        ]
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="member1-container">
      <header className="chat-header">
        <h1>AstraBot</h1>
        <p>Your AI Astronomy Assistant</p>
      </header>

      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.sender}`}>
            <p>{msg.text}</p>
            {msg.citations && (
              <div className="citation-container">
                {msg.citations.map((cite, idx) => (
                  <a key={idx} href={cite.url} target="_blank" rel="noopener noreferrer" className="source-card">
                    Reference: {cite.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">AstraBot is typing...</div>}
      </div>

      <div className="chat-input-area">
        <button className="voice-input-btn" title="Voice Input">🎤</button>
        <input
          type="text"
          placeholder="Ask a question about space..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="send-btn" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Member1;
