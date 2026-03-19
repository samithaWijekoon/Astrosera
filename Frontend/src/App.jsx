import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

const App = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      {/* AnimatePresence listens for route changes and plays exit → enter animations */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />

          <Route path="/events" element={<PageTransition><Member2 /></PageTransition>} />
          <Route path="/achievements" element={<PageTransition><Member4 /></PageTransition>} />
          <Route path="/analytics" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/news" element={<PageTransition><Member6 /></PageTransition>} />
          <Route path="/asteroid-alerts" element={<PageTransition><AsteroidAlerts /></PageTransition>} />

          {/* Member 05 - Admin & Analytics Dashboard */}
          <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />

          {/* Member 03 - Quiz */}
          <Route path="/quiz" element={<PageTransition><Member3 /></PageTransition>} />

          {/* Auth Verification */}
          <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default App
