import React from 'react'
import '../static/styles/Auth.css';
import Navbar from './NavBar';
import Footer from './Footer';


function Registerpage() {
  return (
  <>
    <Navbar />
    <div className="page-content">
      <div className="form-v7-content">
        <div className="form-left">
          <p className="text-1">SignUp</p>
        </div>
        <form className="form-detail" action="#" method="post" id="myform">
          <div className="form-row">
            <label htmlFor="username">USERNAME</label>
            <input type="text" name="username" id="username" className="input-text" />
          </div>
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
            <label htmlFor="confirm_password">CONFIRM PASSWORD</label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              className="input-text"
              required
            />
          </div>
          <div className="form-row-last">
            <input type="submit" name="register" className="register" value="Register" />
            <p>
                Or if you have an account then, <a href="/login">Sign in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </>

  );
}

export default Registerpage
