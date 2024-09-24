import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home"
import PortfolioForm from './components/PortfolioForm';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={ <Home />}></Route>
          <Route path='/portfolio' element={ <PortfolioForm />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
