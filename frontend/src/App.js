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
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:subject" element={<Exam />} />
        <Route path="/monaco/:subject" element={<CodeEditor />} />
      </Routes>
    </div>
  );
}

export default App;

// import React from 'react';
// import GitHubStats from './components/GitHubStats'; 

// const App = () => {
//   return (
//     <div>
//       <GitHubStats />
//     </div>
//   );
// };

// export default App;
