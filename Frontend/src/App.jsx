import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import PageTransition from './component/PageTransition'
import ProtectedRoute from './component/ProtectedRoute'

// ── Code-Split Page Imports ──────────────────────────────────────────────────
// Each page is loaded lazily only when the user navigates to that route.
// This breaks the monolithic bundle into smaller per-route chunks.
const Home           = lazy(() => import('./Pages/Home'))
const Login          = lazy(() => import('./Pages/Login'))
const Signup         = lazy(() => import('./Pages/Signup'))
const Chat           = lazy(() => import('./Pages/chat/chat'))
const Profile        = lazy(() => import('./Pages/Profile'))
const VerifyEmail    = lazy(() => import('./Pages/VerifyEmail'))
const Member2        = lazy(() => import('./Pages/AstroEvent/member2'))
const Member3        = lazy(() => import('./Pages/Member03/member3'))
const Member4        = lazy(() => import('./Pages/Member4/Achievment'))
const Member6        = lazy(() => import('./Pages/Member6/member6'))
const AdminDashboard = lazy(() => import('./Pages/Member05/AdminDashboard'))
const AsteroidAlerts = lazy(() => import('./Pages/AsteroidAlerts/AsteroidAlerts'))

// ── Loading Fallback ─────────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#0a0a0a',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
  }}>
    <span style={{
      display: 'inline-block',
      width: 28,
      height: 28,
      border: '3px solid rgba(124,58,237,0.3)',
      borderTop: '3px solid #7c3aed',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      marginRight: 12,
    }} />
    Loading...
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

const App = () => {
  const location = useLocation();

  // Keep your friend's logic: Hide footer on the Chat page
  const hideFooter = location.pathname === '/chat';

  return (
    <>
      <Navbar />

      {/* Suspense boundary catches all lazy-loaded page chunks */}
      <Suspense fallback={<PageLoader />}>
        {/* Keep the Animation wrapper from Main */}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/"              element={<PageTransition><Home /></PageTransition>} />
            <Route path="/chat"          element={<PageTransition><Chat /></PageTransition>} />
            <Route path="/login"         element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup"        element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/profile"       element={<PageTransition><Profile /></PageTransition>} />

            <Route path="/events"        element={<PageTransition><Member2 /></PageTransition>} />
            <Route path="/achievements"  element={<PageTransition><Member4 /></PageTransition>} />
            <Route path="/analytics"     element={<PageTransition><Home /></PageTransition>} />
            <Route path="/news"          element={<PageTransition><Member6 /></PageTransition>} />
            <Route path="/asteroid-alerts" element={<PageTransition><AsteroidAlerts /></PageTransition>} />

            {/* Member 05 - Admin & Analytics Dashboard */}
            <Route path="/admin"         element={<PageTransition><AdminDashboard /></PageTransition>} />

            {/* Member 03 - Quiz */}
            <Route path="/quiz"          element={<PageTransition><Member3 /></PageTransition>} />

            {/* Auth Verification */}
            <Route path="/verify-email"  element={<PageTransition><VerifyEmail /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {/* Conditional Footer: Show only if not on /chat */}
      {!hideFooter && <Footer />}
    </>
  )
}

export default App