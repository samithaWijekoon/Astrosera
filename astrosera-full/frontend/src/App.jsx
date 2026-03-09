import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './Pages/Home'
import Member2 from './Pages/Member2/member2'
import AsteroidAlerts from './Pages/AsteroidAlerts/AsteroidAlerts'

// Placeholder for other members' pages
const ComingSoon = ({ name }) => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <p className="text-purple-400 text-6xl mb-6">🚀</p>
      <h1 className="text-white text-2xl font-bold mb-2">{name}</h1>
      <p className="text-gray-500">Coming soon — this page is being built by another team member.</p>
    </div>
  </div>
)

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/chat"            element={<ComingSoon name="Astra-Bot" />} />
        <Route path="/events"          element={<Member2 />} />
        <Route path="/quiz"            element={<ComingSoon name="Daily Quiz" />} />
        <Route path="/achievements"    element={<ComingSoon name="Achievements" />} />
        <Route path="/analytics"       element={<ComingSoon name="Analytics" />} />
        <Route path="/news"            element={<ComingSoon name="News" />} />
        <Route path="/asteroid-alerts" element={<AsteroidAlerts />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App