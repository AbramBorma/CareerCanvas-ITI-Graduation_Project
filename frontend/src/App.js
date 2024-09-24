import React from 'react'

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from './context/AuthContext'

import Registerpage from './components/Registerpage'
import Loginpage from './components/Loginpage'
import EditProfile from './components/EditProfile'


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
