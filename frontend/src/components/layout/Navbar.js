import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth'); // Redirect to login page after logout
  };

  const authLinks = (
    <div className="nav-links">
      <span className="nav-user">Hello, {user?.name}</span>
      <Link to="/">Dashboard</Link>
      <Link to="/marketplace">Marketplace</Link>
      <Link to="/requests">My Requests</Link>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="nav-links">
      <Link to="/auth">Login / Register</Link>
    </div>
  );

  return (
    <nav className="navbar">
      <Link className="nav-title" to="/">
        SlotSwapper
      </Link>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;