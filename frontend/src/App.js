import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import Login from './components/Login';
import Home from './components/Home';
import Exams from './components/Exams'; // Import the Exams component
import Exam from './components/Exam'; // Import the Exam component

// Placeholder exam components
const PlaceholderExam = ({ subject, level }) => {
    return (
        <div>
            <h1>{subject} Exam - {level.charAt(0).toUpperCase() + level.slice(1)} Level</h1>
            <p>The exam for {subject} at {level} level will be available soon!</p>
            <p>Exam duration: 15 minutes</p>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/exams" element={<Exams />} /> {/* Add the Exams page route */}

                {/* Individual Exam Routes */}
                <Route path="/exams/html/easy" element={<Exam subject="HTML" level="easy" />} />
                <Route path="/exams/html/intermediate" element={<Exam subject="HTML" level="intermediate" />} />
                <Route path="/exams/html/advanced" element={<Exam subject="HTML" level="advanced" />} />
                
                <Route path="/exams/js/easy" element={<Exam subject="JavaScript" level="easy" />} />
                <Route path="/exams/js/intermediate" element={<Exam subject="JavaScript" level="intermediate" />} />
                <Route path="/exams/js/advanced" element={<Exam subject="JavaScript" level="advanced" />} />
                
                <Route path="/exams/php/easy" element={<Exam subject="PHP" level="easy" />} />
                <Route path="/exams/php/intermediate" element={<Exam subject="PHP" level="intermediate" />} />
                <Route path="/exams/php/advanced" element={<Exam subject="PHP" level="advanced" />} />
                
                <Route path="/exams/python/easy" element={<Exam subject="Python" level="easy" />} />
                <Route path="/exams/python/intermediate" element={<Exam subject="Python" level="intermediate" />} />
                <Route path="/exams/python/advanced" element={<Exam subject="Python" level="advanced" />} />
                
                <Route path="/exams/nodejs/easy" element={<Exam subject="Node.js" level="easy" />} />
                <Route path="/exams/nodejs/intermediate" element={<Exam subject="Node.js" level="intermediate" />} />
                <Route path="/exams/nodejs/advanced" element={<Exam subject="Node.js" level="advanced" />} />
            </Routes>
        </Router>
    );
};

export default App;
