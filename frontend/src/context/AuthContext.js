import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // To decode the JWT token

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => 
        localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null
    );
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));  // Decode the access token to get user details
        } else {
            setUser(null);
        }
    }, [authTokens]);

    // Helper function to get CSRF token from cookies (for registration or other requests)
    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === 'csrftoken=') {
                    cookieValue = cookie.substring(10);
                    break;
                }
            }
        }
        return cookieValue;
    }

    // User registration
    const registerUser = async (email, username, first_name, last_name, password, password2, role, organization, branch, track, linkedin, github, hackerrank, leetcode) => {
        const csrftoken = getCSRFToken();  // Get CSRF token
        try {
            const response = await fetch('http://127.0.0.1:8000/users/api/register/', {  // Updated endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken  // Send CSRF token in headers
                },
                body: JSON.stringify({
                    email,
                    username,
                    first_name,
                    last_name,
                    password,
                    password2,
                    role,
                    organization,
                    branch,
                    track,  
                    linkedin,
                    github,
                    hackerrank,
                    leetcode,
                }),
            });

            if (response.ok) {
                navigate('/login');  // Redirect to login after successful registration
            } else {
                const data = await response.json();
                alert('Error during registration: ' + (data.detail || 'Unknown error'));
            }
        } catch (error) {
            alert('Something went wrong during registration.');
            console.error('Registration error:', error);
        }
    };

    // User login
    const loginUser = async (email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/token/', {  // Updated endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Log the tokens to verify
                console.log("Access Token:", data.access);
                console.log("Refresh Token:", data.refresh);

                // Store access and refresh tokens
                setAuthTokens(data);  // Store access and refresh tokens
                setUser(jwtDecode(data.access));  // Decode the access token to extract user info
                localStorage.setItem('authTokens', JSON.stringify(data));  // Save tokens to localStorage
                return true;  // Indicate successful login
            } else {
                alert('Invalid credentials.');
                return false;  // Indicate login failure
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };
    
    // User logout
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);  
        localStorage.removeItem('authTokens');  // Clear tokens from localStorage
        navigate('/login');  // Redirect to login page
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        registerUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      console.error('Refresh token is missing');
      return;
    }
    try {
      const response = await fetch('/auth/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        return true;
      } else {
        console.error('Failed to refresh token');
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };
  
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.error('Refresh token is missing');
      return;
    }
  
    const response = await fetch('/auth/refresh-token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', data.access);
    } else {
      console.error('Failed to refresh token:', data.error);
    }
  };
