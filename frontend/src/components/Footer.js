import React from 'react';
import '../static/styles/footer.css'
import logo from '../static/imgs/careercanvas-high-resolution-logo-white-transparent.png'
import Button from '@mui/material/Button';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    return (
        <>
            <div className="container">
                <div className="logo">
                    <p>CareerCanvas</p>
                    <img
                    src={logo}
                    alt="Logo"
                    style={{width: '350px', height:'40px', marginRight: '16px'}}
                    />
                </div>
                <div className="internal-links">
                    <p>CareerCanvas Features</p>
                    <ul>
                        <li className='il-linl'>
                            <a href="register.html">Register</a>
                        </li>
                        <li className='il-linl'>
                            <a href="login.html">Login</a>
                        </li>
                        <li className='il-linl'>
                            <a href="portfolio.html">Portfolio</a>
                        </li>
                        <li className='il-linl'>
                            <a href="examination.html">Examination</a>
                        </li>
                    </ul>
                </div>
                <div className="external-links">
                    <p>Follow Us</p>
                    <ul>
                        <li>< FacebookRoundedIcon/></li>
                        <li><XIcon /></li>
                        <li><InstagramIcon /></li>
                    </ul>
                </div>
                <div className="subscribe">
                    <p>Subscribe to our Newsletter</p>
                    <form action="">
                        <input type="email" name="email" id="email" placeholder='Enter Email Address' />
                        <Button type='submit' className='cta-button-borma'>Subscribe</Button>
                    </form>
                </div>
            </div>
        </>
    );
}
 
export default Footer;