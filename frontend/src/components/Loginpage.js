import React from 'react';
import '../static/styles/Auth.css';

function LoginPage() {
  return (
    <div className="page-content">
      <div className="form-v7-content">
        <div className="form-left">
          <p className="text-1">LogIn</p>
        </div>
        <form className="form-detail" action="#" method="post" id="loginform">
          <div className="form-row">
            <label htmlFor="your_email">E-MAIL</label>
            <input
              type="text"
              name="your_email"
              id="your_email"
              className="input-text"
              required
              pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
            />
          </div>
          <div className="form-row">
            <label htmlFor="password">PASSWORD</label>
            <input type="password" name="password" id="password" className="input-text" required />
          </div>
          <div className="form-row">
            <button className="link-button" onClick={() => alert('Forgot Password functionality here')}>
              Forgot password?
            </button>
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
  );
}

export default LoginPage;
