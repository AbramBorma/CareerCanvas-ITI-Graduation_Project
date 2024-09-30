import React from 'react';
import '../static/styles/footer.css';
import logo from '../static/imgs/careercanvas-high-resolution-logo-white-transparent.png';
import Button from '@mui/material/Button';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    return (
        <footer className="footer-container">
            {/* Branding */}
            <div className="footer-section logo">
                <h4>CAREERCANVAS</h4>
                <img
                    src={logo}
                    alt="CareerCanvas Logo"
                    className="footer-logo"
                />
            </div>

            {/* Internal Links */}
            <div className="footer-section internal-links">
                <h4>CAREERCANVAS FEATURES</h4>
                <ul>
                    <li><a href="register.html">Register</a></li>
                    <li><a href="login.html">Login</a></li>
                    <li><a href="portfolio.html">Portfolio</a></li>
                    <li><a href="examination.html">Examination</a></li>
                </ul>
            </div>

            {/* Social Media Links */}
            <div className="footer-section external-links">
                <h4>FOLLOW US</h4>
                <ul>
                    <li>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FacebookRoundedIcon />
                        </a>
                    </li>
                    <li>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                            <XIcon />
                        </a>
                    </li>
                    <li>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <InstagramIcon />
                        </a>
                    </li>
                </ul>
            </div>

            {/* Newsletter Subscription */}
            <div className="footer-section subscribe">
                <h4>SUBSCRIBE TO OUR NEWSLETTER</h4>
                <form action="">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter Email Address"
                    />
                    <Button
                        type="submit"
                        className="cta-button"
                        variant="contained"
                        color="primary"
                    >
                        Subscribe
                    </Button>
                </form>
            </div>
        </footer>
    );
};

export default Footer;
