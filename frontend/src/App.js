import React from 'react'

import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from './context/AuthContext'

import Registerpage from './components/Registerpage'
import Loginpage from './components/Loginpage'
import EditProfile from './components/EditProfile'


import './App.css';
import Navbar from "./components/NavBar"
import PageLanding from "./components/PageLanding"
import Footer from "./components/Footer"
import TimeLine from "./components/TimeLine"

function App() {
  return (
    <div className="App">
      <Navbar />
      <PageLanding />
      <TimeLine />
      <Footer />
    </div>
  );
}

export default App;
