import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PortfolioForm from './components/PortfolioForm';
import Registerpage from './components/Registerpage';
import LoginPage from './components/Loginpage';
import Exams from './components/Exams';
import Exam from './components/Exam';
import CodeEditor from './components/CodeEditor';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import OrganizationDashboard from './components/organizationdashboard'; // Import the OrganizationDashboard component

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio/form" element={<PortfolioForm />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:subject" element={<Exam />} />
        <Route path="/monaco/:subject" element={<CodeEditor />} />
        
        {/* Add the new route for OrganizationDashboard */}
        <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
