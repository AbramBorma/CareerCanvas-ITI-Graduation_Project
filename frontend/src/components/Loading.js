// Loading.js
import React from 'react';
import '../App';
import logo from '../static/imgs/careercanvas-high-resolution-logo-white-transparent.png'; // Adjusted import path

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="logo-animation">
        <img src={logo} alt="Logo" className="loading-logo" />
      </div>
    </div>
  );
};

export default Loading;
