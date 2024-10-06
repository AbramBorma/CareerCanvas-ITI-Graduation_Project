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
import useProtectedRoute from './hooks/useProtectedRoute'; 

function App() {
  const { user } = useContext(AuthContext); // Get the user context
  const isProtected = useProtectedRoute(); // Call the hook at the top level

  return (
    <>
      <NavBar /> {/* Render the NavBar */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/form" element={<PortfolioForm />} />
          
          <Route path="/portfolio" 
                 element={
                   user && user.role === 'student' ? (
                     isProtected ? <PortfolioPage /> : <LoginPage />
                   ) : (
                     <LoginPage />
                   )
                 } 
          />
          
          <Route path="/portfolio/:fullName/:studentId" element={<SupervisorStudentPortfolio />} /> 
          <Route path="/register" element={<Registerpage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:subject" element={<Exam />} />
          <Route path="/monaco/:subject" element={<CodeEditor />} />
           
          <Route path="/edit-profile" 
                 element={
                   user ? (
                     isProtected ? <EditProfile /> : <LoginPage />
                   ) : (
                     <LoginPage />
                   )
                 } 
          />

          {/* Conditional rendering of dashboard routes based on user role */}
          {user && user.role === 'admin' && (
            <Route 
              path="/branch-admin-dashboard" 
              element={isProtected ? <BranchAdminDashboard /> : <LoginPage />} // Protect BranchAdminDashboard
            />
          )}

           {user && user.role === 'supervisor' && (
            <Route 
              path="/SDashboard" 
              element={isProtected ? <SupervisorDashboard /> : <LoginPage />} // Protect SupervisorDashboard
            />
          )}

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
