import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter} from 'react-router-dom';


// Suppress ResizeObserver errors
if (typeof window !== "undefined") {
  const resizeObserverErr = (e) => {
    e.preventDefault();
  };
  window.addEventListener("error", resizeObserverErr);
  window.addEventListener("unhandledrejection", resizeObserverErr);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <BrowserRouter>
    <App />
   </BrowserRouter>
);

reportWebVitals();
