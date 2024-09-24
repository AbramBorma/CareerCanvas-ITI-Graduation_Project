import { Routes, Route } from 'react-router-dom';
// import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from './components/Home';
import Exams from './components/Exams';
import Exam from './components/Exam'; 
import CodeEditor from './components/CodeEditor'

function App() {
    return (
      <>
      <Navbar />
      <div className="App">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/monaco" element={<CodeEditor />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/:subject" element={<Exam />} />
          </Routes>
       </div>
        <Footer />
        </>
    );
}

export default App;
