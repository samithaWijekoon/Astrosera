import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './Pages/Home'
import Member6 from './Pages/Member6/member6'
import Member3 from './Pages/Member03/member3'
import Member4 from './Pages/Member4/member4'

const App = () => {
  return (


    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Home />} />
        <Route path="/events" element={<Home />} />
        <Route path="/quiz" element={<Member3 />} />
        <Route path="/achievements" element={<Member4 />} />
        <Route path="/analytics" element={<Home />} />
        <Route path="/news" element={<Member6 />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App