// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Suppress ResizeObserver errors
if (typeof window !== "undefined") {
  const resizeObserverErr = (e) => {
    e.preventDefault();
  };
  window.addEventListener("error", resizeObserverErr);
  window.addEventListener("unhandledrejection", resizeObserverErr);
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
