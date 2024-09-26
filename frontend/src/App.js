import React from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home"
import PortfolioForm from './components/PortfolioForm';
import Registerpage from './components/Registerpage'
import LoginPage from './components/Loginpage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={ <Home />}></Route>
          <Route path='/portfolio/form' element={ <PortfolioForm />}></Route>
          <Route path="/register" element={<Registerpage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
