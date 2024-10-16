import axios from 'axios';

// Simple Axios instance without token refresh logic
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your backend API URL
});

// Optionally add interceptors if needed, but it's already handled in useAxios.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
