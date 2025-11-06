import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data);
      navigate('/');
    } catch (err)
      {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p className="error-text">{error}</p>}
      <div className="form-group">
        <label htmlFor="reg-name">Name</label>
        <input
          id="reg-name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
    </form>
  );
};

export default Register;