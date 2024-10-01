import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../static/styles/Auth.css';
import Navbar from './NavBar';
import Footer from './Footer';

function LoginPage() {
  // Extract loginUser from AuthContext
  const { loginUser } = useContext(AuthContext);
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate(); 

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(email, password);  // Use loginUser from AuthContext
    if (success) {
      navigate('/');  // Redirect to home page on successful login
    } else {
      setErrorMessage('Invalid email or password. Please try again.');
    }
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
                className={passwordShown ? 'fa fa-eye-slash' : 'fa fa-eye'}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            {/* Display error message if login fails */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <div className="form-row-forgotten">
              <Link to="/ForgotPassword" className="forgot-password-link">
                Forgotten Password?
              </Link>
            </div>

            <div className="form-row-last">
              <input type="submit" name="login" className="register" value="Login" />
              <p>You don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;
