import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthModal from './component/AuthModal';
import { AnimatePresence } from 'framer-motion'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import PageTransition from './component/PageTransition'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Member2 from './Pages/AstroEvent/member2'
import Member6 from './Pages/Member6/member6'
import Member4 from './Pages/Member4/Achievment'
import AdminDashboard from './Pages/Member05/AdminDashboard';
import Chat from './Pages/chat/chat'
import Profile from './Pages/Profile'
import AsteroidAlerts from './Pages/AsteroidAlerts/AsteroidAlerts'
import Member3 from './Pages/Member03/member3'
import VerifyEmail from './Pages/VerifyEmail'
import ProtectedRoute from './component/ProtectedRoute'

// Auth Gaters
const TimeGater = ({ delay, message, children }) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) {
      if (delay === 0) {
        setShowModal(true);
      } else {
        const timer = setTimeout(() => setShowModal(true), delay);
        return () => clearTimeout(timer);
      }
    }
  }, [delay]);
  return (
    <>
      <div className="contents">{children}</div>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} message={message} />
    </>
  );
};

const ChatGater = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const msgCountRef = useRef(0);

  const handleCapture = (e) => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (userId) return;

    let isSubmit = false;
    if (e.type === 'keydown' && e.key === 'Enter' && !e.shiftKey) {
       isSubmit = true;
    }
    if (e.type === 'click') {
       const btn = e.target.closest('button');
       if (btn && btn.textContent.includes('Send')) {
          isSubmit = true;
       }
    }

    if (isSubmit) {
       if (msgCountRef.current >= 2) {
          e.stopPropagation();
          e.preventDefault();
          setShowModal(true);
       } else {
          msgCountRef.current += 1;
       }
    }
  };

  return (
    <div onClickCapture={handleCapture} onKeyDownCapture={handleCapture} className="contents">
      {children}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} message="Our AI is getting to know you! Sign in to save your chat history and continue the conversation." />
    </div>
  );
};

const QuizGater = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCapture = (e) => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (userId) return;

    if (e.type === 'click') {
       const btn = e.target.closest('button');
       if (btn && btn.textContent.includes('Launch Mission')) {
           e.stopPropagation();
           e.preventDefault();
           setShowModal(true);
       }
    }
  };

  return (
    <div onClickCapture={handleCapture} className="contents">
      {children}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} message="Sign in to save your quiz progress and earn badges!" />
    </div>
  );
};

const App = () => {
  const location = useLocation();
  
  // Keep your friend's logic: Hide footer on the Chat page
  const hideFooter = location.pathname === '/chat';

  return (
    <>
      <Navbar />
      
      {/* Keep the Animation wrapper from Main */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/chat" element={<ChatGater><PageTransition><Chat /></PageTransition></ChatGater>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />

          <Route path="/events" element={<PageTransition><Member2 /></PageTransition>} />
          <Route path="/achievements" element={<TimeGater delay={0} message="See where you rank! Sign in to join the Astrosera global leaderboard."><PageTransition><Member4 /></PageTransition></TimeGater>} />
          <Route path="/analytics" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/news" element={<TimeGater delay={30000} message="Explore more of the universe! Sign in to get personalized space news and alerts."><PageTransition><Member6 /></PageTransition></TimeGater>} />
          <Route path="/asteroid-alerts" element={<PageTransition><AsteroidAlerts /></PageTransition>} />

          {/* Member 05 - Admin & Analytics Dashboard */}
          <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />

          {/* Member 03 - Quiz */}
          <Route path="/quiz" element={<QuizGater><PageTransition><Member3 /></PageTransition></QuizGater>} />

          {/* Auth Verification - Wrapped in PageTransition for consistency */}
          <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      {/* Conditional Footer: Show only if not on /chat */}
      {!hideFooter && <Footer />}
    </>
  )
}

export default App