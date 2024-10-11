import { useState } from 'react';
import axios from 'axios';
import '../static/styles/Auth.css'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/users/send-reset-password/', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error sending reset email.');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label htmlFor="email">Enter your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="input-text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row-last">
                        <input type="submit" value="Send Reset Email" className="register" />
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
