import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<AlertsPage />} />
          </Routes>
        </div>
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastStyle={{
            background: '#0a1020',
            border: '1px solid rgba(245,166,35,0.3)',
            color: '#e8d5a0',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 13,
          }}
        />
      </BrowserRouter>
    </UserProvider>
  );
}
