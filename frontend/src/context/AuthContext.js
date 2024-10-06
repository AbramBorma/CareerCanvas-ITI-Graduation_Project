import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // To decode the JWT token
import { toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
import sgMail from '@sendgrid/mail';


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

    sgMail.setApiKey('SKb36393484a3d258ed13d476f95b78e36');
    

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
    
    const msg = {
        to: email,
        from: 'ahmedttaarek@gmail.com', // Verified sender email
        subject: 'Verify your email',
        text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
        html: `<strong>Please verify your email by clicking on the following link: <a href="${verificationUrl}">Verify Email</a></strong>`,
    };

    try {
        await sgMail.send(msg);
        console.log('Verification email sent');
    } catch (error) {
        console.error('Error sending verification email', error);
    }
};

// User registration
const registerUser = async (
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
    leetcode
  ) => {
    const csrftoken = getCSRFToken();  // Get CSRF token
  
    // Function to validate URLs
    const isValidURL = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };
  
    // Validation before making the request
    if (!username || username.includes('@')) {
      toast.error('Please enter a valid username, not an email.');
      return;
    }
  
    if (!isValidURL(linkedin) || !isValidURL(github) || !isValidURL(hackerrank) || !isValidURL(leetcode)) {
      toast.error('Please enter valid URLs for LinkedIn, GitHub, HackerRank, and LeetCode.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/users/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,  // Send CSRF token in headers
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
        const data = await response.json();
        const verificationToken = data.token; // Token returned from backend for email verification
        await sendVerificationEmail(email, verificationToken);  // Send verification email

        toast.success('Registration successful! Redirecting to login...');
        navigate('/login');  // Redirect to login after successful registration
      } else {
        const data = await response.json();
        if (data.detail) {
          toast.error('Email is already registered. Please try another one.');
        } else {
          toast.error('Registration failed: ' + JSON.stringify(data));
        }
      }
    } catch (error) {
      toast.error('Something went wrong during registration.');
      console.error('Registration error:', error);
    }
  };


         // User login
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
              const decodedToken = jwtDecode(data.access);

              if (!decodedToken.email_verified) {
                  toast.error('Please verify your email to log in.');
                  return false;
              }

              if (!decodedToken.is_approved_by_admin) {
                  toast.error('Not approved yet by the admin.');
                  return false;
              }

              setAuthTokens(data);  // Store tokens
              setUser(jwtDecode(data.access));  // Decode and set user info
              localStorage.setItem('authTokens', JSON.stringify(data));  // Save tokens to localStorage
              navigate('/dashboard');  // Navigate to dashboard upon successful login
              return true;
          } else {
              toast.error('Invalid credentials.');
              return false;
          }
      } catch (error) {
          console.error('Login error:', error);
          toast.error('Login failed. Please try again.');
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
