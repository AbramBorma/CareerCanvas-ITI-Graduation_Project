import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'; 
import AuthContext from '../context/AuthContext';
import '../static/styles/Auth.css';
import Navbar from './NavBar';
import Footer from './Footer';

function LoginPage() {
  const { loginUser } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password); 
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
      <div className="form-v7-content">
        <div className="form-left">
          <p className="text-1">LogIn</p>
        </div>
        <form className="form-detail" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="your_email">E-MAIL</label>
            <input
              type="text"
              name="your_email"
              id="your_email"
              className="input-text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
            />
          </div>
          <div className="form-row password-container">
            <label htmlFor="password">PASSWORD</label>
            <input
              type={passwordShown ? 'text' : 'password'}
              name="password"
              id="password"
              className="input-text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fa ${passwordShown ? 'fa-eye-slash' : 'fa-eye'} password-icon`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>

          <div className="form-row-forgotten">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgotten Password?
            </Link>
          </div>

          <div className="form-row-last">
            <input type="submit" name="login" className="register" value="Login" />
            <p>
              You don't have an account? <a href="/register">Sign Up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default LoginPage;
