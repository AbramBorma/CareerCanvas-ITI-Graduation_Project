import React, { useState } from 'react';
import '../static/styles/PortfolioPage.css';
import githubIcon from '../static/imgs/github.png';
import hackerrankIcon from '../static/imgs/hackerrank.png';
import leetcodeIcon from '../static/imgs/leetcode.png';
import linkedinIcon from '../static/imgs/linkedin.png';

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
          Mariam
        </div>
      </div>

      {/* Social Links Section */}
      <div className="box github-box">
        <h3>GitHub</h3>
        <div className="box-content">
          <img src={githubIcon} alt="GitHub Icon" className="social-icon" />
          <div className="box-divider"></div>
          <div className="dummy-data">
            <p>Repositories: 14</p>
            <p>Commits: 200</p>
            <p>Followers: 120</p>
            <p>Following: 80</p>
          </div>
        </div>
      </div>
      
      <div className="box linkedin-box">
        <h3>LinkedIn</h3>
        <div className="box-content">
          <img src={linkedinIcon} alt="LinkedIn Icon" className="social-icon" />
          <div className="box-divider"></div>
          <div className="dummy-data">
            <p>Connections: 500+</p>
            <p>Posts: 30</p>
            <p>Profile Views: 150</p>
          </div>
        </div>
      </div>

      <div className="box leetcode-box">
        <h3>LeetCode</h3>
        <div className="box-content">
          <img src={leetcodeIcon} alt="LeetCode Icon" className="social-icon" />
          <div className="box-divider"></div>
          <div className="dummy-data">
            <p>Problems Solved: 100</p>
            <p>Rank: 1500</p>
            <p>Contests Participated: 5</p>
          </div>
        </div>
      </div>

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
        <h3> Progress</h3>
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
