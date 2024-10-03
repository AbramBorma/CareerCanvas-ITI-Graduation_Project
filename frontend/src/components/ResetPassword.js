import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../static/styles/Auth.css'; 

const ResetPassword = () => {
    const { uid, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    console.log("UID:", uid);
    console.log("Token:", token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://127.0.0.1:8000/users/reset-password-confirm/${uid}/${token}/`, {
                new_password: newPassword,
            });

            setMessage(response.data.message || 'Password reset successful!');
        } catch (error) {
            setMessage('Error resetting password.');
        }
    };
    useNavigate('/login');

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label htmlFor="newPassword">Enter new password</label>
                        <input
                            type="password"
                            id="newPassword"
                            className="input-text"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row-last">
                        <input type="submit" value="Reset Password" className="register" />
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
