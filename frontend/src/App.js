import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PortfolioForm from './components/PortfolioForm';
import Registerpage from './components/Registerpage';
import LoginPage from './components/Loginpage';
import Exams from './components/Exams';
import Exam from './components/Exam';

function App() {
  return (

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/form" element={<PortfolioForm />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:subject" element={<Exam />} />
        </Routes>
      </div>

  );
}

export default App;
