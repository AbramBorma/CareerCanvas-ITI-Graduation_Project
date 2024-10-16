import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

if (typeof window !== 'undefined') {
  const resizeObserverErr = (e) => {
    e.preventDefault();
  };
  window.addEventListener('error', resizeObserverErr);
  window.addEventListener('unhandledrejection', resizeObserverErr);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals();
