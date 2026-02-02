import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Member6 from './Pages/Member6/member6'
import Member3 from './Pages/Member03/member3'
import Member4 from './Pages/Member4/Achievment'

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Home />} />
        <Route path="/events" element={<Home />} />
        <Route path="/quiz" element={<Member3 />} />
        <Route path="/achievements" element={<Member4 />} />
        <Route path="/analytics" element={<Home />} />
        <Route path="/news" element={<Member6 />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App