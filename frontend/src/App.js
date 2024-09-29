import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NavBar from './components/NavBar';
import PortfolioForm from './components/PortfolioForm';
import Registerpage from './components/Registerpage';
import LoginPage from './components/Loginpage';
import Exams from './components/Exams';
import Exam from './components/Exam';
import CodeEditor from './components/CodeEditor'

function App() {
  return (
    <> 
    <NavBar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/form" element={<PortfolioForm />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:subject" element={<Exam />} />
          <Route path="/monaco/:subject" element={<CodeEditor />} />
        </Routes>
      </div>
    </>

  );
}

export default App;