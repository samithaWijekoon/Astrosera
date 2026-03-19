import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Member2 from './Pages/AstroEvent/member2'
import Member6 from './Pages/Member6/member6'
import Member4 from './Pages/Member4/Achievment'
import AdminDashboard from './Pages/Member05/AdminDashboard';
import Chat from './Pages/chat/chat' // Keep this import!
import Profile from './Pages/Profile'
import AsteroidAlerts from './Pages/AsteroidAlerts/AsteroidAlerts'
import Member3 from './Pages/Member03/member3'
import VerifyEmail from './Pages/VerifyEmail'

const App = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/chat';

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/chat" element={<Chat />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/events" element={<Member2 />} />
        <Route path="/achievements" element={<Member4 />} />
        <Route path="/analytics" element={<Home />} />
        <Route path="/news" element={<Member6 />} />
        <Route path="/asteroid-alerts" element={<AsteroidAlerts />} />
        
        {/* Member 05 - Admin & Analytics Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Member 03 - Quiz */}
        <Route path="/quiz" element={<Member3 />} />

        {/* Auth Verification */}
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  )
}

export default App
