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
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import SupervisorDashboard from './components/SupervisorDashboard';

function App() {
  const { user } = useContext(AuthContext); // Get the user context

  return (
    <div className="App">
      <NavBar /> {/* Render the NavBar */}
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
        
        {/* Conditional rendering of dashboard routes based on user role */}
        {user && user.role === 'admin' && (
          <Route path="/branch-admin-dashboard" element={<BranchAdminDashboard />} />
        )}
        {user && user.role === 'supervisor' && (
          <Route path="/SDashboard" element={<SupervisorDashboard />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
