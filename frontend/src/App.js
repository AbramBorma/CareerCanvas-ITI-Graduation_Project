import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from './context/AuthContext';

import RegisterPage from './components/Registerpage';
import LoginPage from './components/Loginpage';
import EditProfile from './components/EditProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

import './App.css';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>


          <Routes>
            {/* Redirect the root path to the login page */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Define the login page route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Define the registration page route */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Define the forgot password route */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Define the reset password route */}
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

            {/* Example of a private route for editing profile */}
            {/* 
            <Route 
              path="/edit-profile" 
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              } 
            /> 
            */}
          </Routes>

          {/* Include Footer */}
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
