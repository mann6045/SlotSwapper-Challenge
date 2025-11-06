import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="form-container">
      {isLogin ? <Login /> : <Register />}
      <div className="text-center" style={{ marginTop: '20px' }}>
        <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
          {isLogin ? 'Need to create an account?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;