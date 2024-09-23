import '../App.css';
import React from 'react';
import PageLanding from "./PageLanding"
import TimeLine from "./TimeLine"
// import Navbar from "./NavBar";
// import Footer from "./Footer";


const Home = () => {
    return (
        <div className="App">
          <PageLanding />
          <TimeLine />
        </div>
      );
};

export default Home;


