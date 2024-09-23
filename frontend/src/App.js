import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import Login from './components/Login';
import Home from './components/Home';
import Exams from './components/Exams';
import Exam from './components/Exam'; 

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/exams" element={<Exams />} />

                {/* Individual Exam Routes */}
                <Route path="/exams/:subject/:level" element={<Exam />} />
            </Routes>
        </Router>
    );
};

export default App;
