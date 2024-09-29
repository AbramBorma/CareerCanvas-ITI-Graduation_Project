import React, { useState } from 'react';
import '../static/styles/PortfolioPage.css';
import hackerrankIcon from '../static/imgs/hackerrank.png';
import Navbar from "./NavBar"
import Footer from "./Footer"


const PortfolioPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="portfolio-page">
      {/* User Profile Section */}
      <div className="box user-info-box centered">
        <div className="profile-pic-container">
          <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-pic"
          />
          <div className="change-photo-overlay">
            <label className="change-photo-text">
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              Change profile
            </label>
          </div>
        </div>
        <div className="user-name centered-text">
          Mariam Abdelmagied
        </div>
      </div>

      {/* GitHub Section */}
      <div className="box github-box">
        <h3>GitHub</h3>
        <div className="box-content">
          <div className="github-stats">
            <img src="https://github-readme-stats.vercel.app/api?username=mariamabdk3m&show_icons=true&theme=radical" alt="GitHub Stats" />
            <img src="https://github-readme-streak-stats.herokuapp.com/?user=mariamabdk3m&theme=radical" alt="GitHub Streak" />
            <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=mariamabdk3m&layout=compact&theme=radical" alt="Most Used Languages" />
            <img src="https://github-profile-trophy.vercel.app/?username=mariamabdk3m&theme=radical&no-frame=true&column=7" alt="GitHub Trophies" />
          </div>
        </div>
      </div>

      {/* HackerRank Section */}
      <div className="box hackerrank-box">
        <h3>HackerRank</h3>
        <div className="box-content">
          <img src={hackerrankIcon} alt="HackerRank Icon" className="social-icon" />
          <div className="box-divider"></div>
          <div className="dummy-data">
            <p>Challenges Completed: 50</p>
            <p>Rank: 3000</p>
            <p>Badges Earned: 10</p>
          </div>
        </div>
      </div>

      {/* Skills Progress Section */}
      <div className="box skills-progress-box">
        <h3>Progress</h3>
        <div className="skill">
          <label>Javascript</label>
          <progress value="70" max="100" className="progress-bar"></progress>
        </div>
        <div className="skill">
          <label>Python</label>
          <progress value="50" max="100" className="progress-bar"></progress>
        </div>
        <div className="skill">
          <label>NodeJS</label>
          <progress value="30" max="100" className="progress-bar"></progress>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
