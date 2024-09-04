import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm'; // Ensure the path is correct
import Login from './components/Login'; // Ensure the path is correct

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login />} />
                {/* Add other routes here */}
            </Routes>
        </Router>
    );
};

export default App;
