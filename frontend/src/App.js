// App.js

import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
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
import AuthContext from './context/AuthContext';
import GitHubStats from './components/GitHubStats';
import EditProfile from './components/EditProfile';
import CreateExam from './components/CreateExam';
import StudentApprovalMessage from './components/StudentApprovalMessage';
import SupervisorApprovalMessage from './components/SupervisorApprovalMessage';
import AdminApprovalMessage from './components/AdminApprovalMessage';
import CustomQuestion from './components/CustomQuestion';
import ActivateEmail from './components/ActivateEmail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Loading from './components/Loading';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 900); // Adjust the delay as needed

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      <NavBar />
      <div className="App">
        <ToastContainer />

          {loading ? (
            <Loading />  // Use Loading component
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio/form" element={<PortfolioForm />} />
            <Route
              path="/portfolio"
              element={
                user && user.role === 'student' ? (
                  user.is_authorized ? (
                    <PortfolioPage />
                  ) : (
                    <StudentApprovalMessage />
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
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

            <Route
              path="/exams"
              element={
                user && user.role === 'student' ? (
                  user.is_authorized ? (
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

            <Route
              path="/branch-admin-dashboard"
              element={
                user && user.role === 'admin' ? (
                  user.is_authorized ? (
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
                  user.is_authorized ? (
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
                  user.is_authorized ? (
                    <CreateExam />
                  ) : (
                    <SupervisorApprovalMessage />
                  )
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="/CustomQuestion"
              element={
                user && user.role === 'supervisor' ? (
                  user.is_authorized ? (
                    <CustomQuestion />
                  ) : (
                    <SupervisorApprovalMessage />
                  )
                ) : (
                  <LoginPage />
                )
              }
            />

            <Route path="/github-stats" element={<GitHubStats />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        )}

        {/* Render Footer only if not loading */}
        {!loading && <Footer />}
      </div>
    </>
  );
}

export default App;
