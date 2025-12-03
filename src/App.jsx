import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ShotgunAI from './components/ShotgunAI';
import LoginPage from './components/LoginPage';
import AcceptInvite from './components/AcceptInvite';

function App() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="warm-cream-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="pixel-font text-4xl deep-forest mb-4">SHOTGUN.AI</div>
          <div className="mono-font text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Invite acceptance route - accessible without auth */}
        <Route path="/invite/:inviteId" element={<AcceptInvite />} />

        {/* Login route */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />

        {/* Main app route - requires auth */}
        <Route
          path="/"
          element={user ? <ShotgunAI /> : <Navigate to="/login" />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
