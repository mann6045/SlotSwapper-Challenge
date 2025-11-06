import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  This is an interceptor. It runs before every request.
  It checks if we have a token in localStorage, and if so,
  it adds it to the 'Authorization' header.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;