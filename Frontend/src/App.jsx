import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Member2 from './Pages/Member2/member2'
import Member6 from './Pages/Member6/member6'
import Member3 from './Pages/Member03/member3'
import Member4 from './Pages/Member4/Achievment'
import AdminDashboard from './Pages/Member05/AdminDashboard';
import Chat from './Pages/chat/chat' // Keep this import!
import Profile from './Pages/Profile'
import AsteroidAlerts from './Pages/AsteroidAlerts/AsteroidAlerts'

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/chat" element={<Chat />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/events" element={<Member2 />} />
        <Route path="/quiz" element={<Member3 />} />
        <Route path="/achievements" element={<Member4 />} />
        <Route path="/analytics" element={<Home />} />
        <Route path="/news" element={<Member6 />} />
        <Route path="/asteroid-alerts" element={<AsteroidAlerts />} />
        
        {/* Member 05 - Admin & Analytics Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App