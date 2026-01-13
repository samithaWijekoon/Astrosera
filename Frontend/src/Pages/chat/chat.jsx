import React, { useState, useEffect, useRef } from 'react';
import './member1.css';

// Member 01: Intelligent Chatbot & RAG Engine (AstraBot)
const Member1 = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am AstraBot. Ask me anything about the cosmos.", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Generate a random session ID for this user when the component mounts
  const sessionId = useRef("session_" + Math.random().toString(36).substr(2, 9));

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    setInput(""); // Clear input immediately

    // 1. Add User Message
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // 2. Call FastAPI Backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId.current,
          question: userText
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // 3. Add Bot Response
      const botMsg = { 
        id: Date.now() + 1, 
        text: data.answer, 
        sender: 'bot',
        citations: data.citations // Pydantic ensures this structure matches
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error connecting to AstraBot API:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Sorry, I'm having trouble connecting to my knowledge base right now.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
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
            {/* Render Citations if they exist and have length > 0 */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="citation-container">
                {msg.citations.map((cite, idx) => (
                  <div key={idx} className="source-card" title={cite.url}>
                    Reference: {cite.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">AstraBot is thinking...</div>}
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