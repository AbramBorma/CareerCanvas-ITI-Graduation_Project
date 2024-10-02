import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NavBar from './components/NavBar';
import PortfolioForm from './components/PortfolioForm';
import Registerpage from './components/Registerpage';
import LoginPage from './components/Loginpage';
import Exams from './components/Exams';
import Exam from './components/Exam';
import CodeEditor from './components/CodeEditor';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import BranchAdminDashboard from './components/BranchAdminDashboard';
import PortfolioPage from './components/portfolioPage';
import SupervisorDashboard from './components/SupervisorDashboard';
import Footer from './components/Footer';
import SupervisorStudentPortfolio from './components/SupervisorStudentPortfolio'
import { useContext } from 'react';
import'./App.css';
import AuthContext from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext); // Get the user context

  return (
  <>
    <NavBar /> {/* Render the NavBar */}
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio/form" element={<PortfolioForm />} />
        <Route path="/portfolio/" element={<PortfolioPage />} /> 
        <Route path="/portfolio/:fullName/:studentId/" element={<SupervisorStudentPortfolio />} /> 
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:subject" element={<Exam />} />
        <Route path="/monaco/:subject" element={<CodeEditor />} />

        {/* Conditional rendering of dashboard routes based on user role */}
        {user && user.role === 'admin' && (
          <Route path="/branch-admin-dashboard" element={<BranchAdminDashboard />} />
        )}
        {user && user.role === 'supervisor' && (
          <Route path="/SDashboard" element={<SupervisorDashboard />} />
        )}
      </Routes>
      <Footer />
    </div>
    </>
  );
}

export default App;

// frontend/src/app.js
// App.js
// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import GitHubStats from "./components/GitHubStats";

// function App() {
//   return (
//     <Routes>
//       <Route path="/github-stats" element={<GitHubStats />} />
//     </Routes>
//   );
// }

// export default App;
