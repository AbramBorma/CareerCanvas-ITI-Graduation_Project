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
import OrganizationDashboard from './components/organizationdashboard'; 
import PortfolioPage from './components/portfolioPage'; 
import { AuthProvider } from './context/AuthContext';
import SupervisorDashboard from './components/SupervisorDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio/form" element={<PortfolioForm />} />
        <Route path="/portfolio" element={<PortfolioPage />} /> 
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:subject" element={<Exam />} />
        <Route path="/monaco/:subject" element={<CodeEditor />} />
        <Route path="/SDashboard" element={<SupervisorDashboard />} />
        <Route path="/organization-dashboard" element={<OrganizationDashboard />} /> 
        
      </Routes>
    </div>
  );
}

export default App;

// import React from 'react';
// import PortfolioPage from './components/portfolioPage';

// const App = () => {
//   return (
//     <div>
//       <PortfolioPage />
//     </div>
//   );
// };

// export default App;
