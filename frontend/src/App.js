import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Requests from './pages/Requests';
import AuthPage from './pages/AuthPage';

// Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/protected/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  // Show a loading spinner or null while checking auth state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <> {/* Use a fragment */}
      <Navbar />
      <div className="app-container"> {/* Add this wrapper */}
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/requests" 
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </div>
    </>
  );
}

export default App;