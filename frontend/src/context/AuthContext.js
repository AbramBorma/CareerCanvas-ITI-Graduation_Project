import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')).user : null
    );
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            setUser(authTokens.user);
        } else {
            setUser(null);
        }
    }, [authTokens]);

    const loginUser = async (email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/token/', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
        
            const data = await response.json();
        
            if (response.ok) {
                setAuthTokens(data);
                setUser(data.user);  
                localStorage.setItem('authTokens', JSON.stringify(data));
                return true;  
            } else {
                alert('Invalid credentials.');
                return false;  
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };
    
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);  
        localStorage.removeItem('authTokens');
        navigate('/login');  
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
