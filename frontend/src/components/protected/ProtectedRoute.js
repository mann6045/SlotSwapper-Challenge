import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // Redirect them to the /auth page
    return <Navigate to="/auth" replace />;
  }

  return children; // Render the component they were trying to access
};

export default ProtectedRoute;