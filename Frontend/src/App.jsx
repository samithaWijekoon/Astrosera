import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './Pages/Home'

const App = () => {
  return (


    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Home />} />
        <Route path="/events" element={<Home />} />
        <Route path="/quiz" element={<Home />} />
        <Route path="/achievements" element={<Home />} />
        <Route path="/analytics" element={<Home />} />
        <Route path="/news" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App