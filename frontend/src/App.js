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
import SupervisorStudentPortfolio from './components/SupervisorStudentPortfolio';
import { useContext } from 'react';
import './App.css';
import AuthContext from './context/AuthContext';
import GitHubStats from './components/GitHubStats';
import EditProfile from './components/EditProfile';
import CreateExam from './components/CreateExam';
import StudentApprovalMessage from './components/StudentApprovalMessage';
import SupervisorApprovalMessage from './components/SupervisorApprovalMessage';
import AdminApprovalMessage from './components/AdminApprovalMessage';
import ActivateEmail from './components/ActivateEmail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user } = useContext(AuthContext); // Get the user context

  return (
    <>
      <NavBar /> {/* Render the NavBar */}
      <div className="App">
      <ToastContainer /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/form" element={<PortfolioForm />} />
          
          {/* Portfolio Route */}
          <Route 
            path="/portfolio" 
            element={
              user && user.role === 'student' ? (
                user.is_authorized === true ? (
                  <PortfolioPage />
                ) : (
                  <StudentApprovalMessage/>
                )
              ) : (
                <LoginPage />
              )
            } 
          />
          
          <Route path="/portfolio/:fullName/:studentId" element={<SupervisorStudentPortfolio />} /> 
          <Route path="/register" element={<Registerpage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/activate-email" element={<ActivateEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          
          {/* Exams Route */}
          <Route 
            path="/exams" 
            element={
              user && user.role === 'student' ? (
                user.is_authorized === true ? (
                  <Exams />
                ) : (
                  <StudentApprovalMessage />
                )
              ) : (
                <LoginPage />
              )
            } 
          />

          <Route path="/exams/:subject" element={<Exam />} />
          <Route path="/monaco/:subject" element={<CodeEditor />} />
          
          {/* Edit Profile Route */}
          <Route 
            path="/edit-profile" 
            element={
              user ? (
                <EditProfile />
              ) : (
                <LoginPage />
              )
            } 
          />

          {/* Conditional rendering of dashboard routes based on user role */}
          <Route 
            path="/branch-admin-dashboard" 
            element={
              user && user.role === 'admin' ? (
                user.is_authorized === true ? (
                  <BranchAdminDashboard />
                ) : (
                  <AdminApprovalMessage />
                )
              ) : (
                <LoginPage />
              )
            } 
          />

          <Route 
            path="/SDashboard" 
            element={
              user && user.role === 'supervisor' ? (
                user.is_authorized === true ? (
                  <SupervisorDashboard />
                ) : (
                  <SupervisorApprovalMessage />
                )
              ) : (
                <LoginPage />
              )
            } 
          />

          <Route 
            path="/SCreateExam" 
            element={
              user && user.role === 'supervisor' ? (
                user.is_authorized === true ? (
                  <CreateExam />
                ) : (
                  <SupervisorApprovalMessage />
                )
              ) : (
                <LoginPage />
              )
            } 
          />

          
          <Route path="/github-stats" element={<GitHubStats />} />

          {/* Fallback route for unmatched paths */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
        
        <Footer />
      </div>
    </>
  );
}

export default App;
