import React, { useContext, useEffect, useState } from 'react';
import '../static/styles/PortfolioPage.css';
import AuthContext from '../context/AuthContext';
import { leetCode } from '../services/api';

const SupervisorStudentPortfolio = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useContext(AuthContext);
  const [leetcodeUsername, setLeetCodeUsername] = useState(''); // State to hold LeetCode username
  const [loadingLeetCode, setLoadingLeetCode] = useState(true);
  const [error, setError] = useState(null);
  const leetcodeBaseURL = 'https://leetcard.jacoblin.cool/';

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      if (user && user.user_id) {
        try {
          setLoadingLeetCode(true);
          const data = await leetCode(user.user_id); // Fetch data using the leetCode function
          if (data.username) {
            setLeetCodeUsername(data.username); // Set the username
          } else {
            setError('No LeetCode statistics available.');
          }
        } catch (error) {
          setError('Failed to fetch LeetCode Statistics');
          console.error("Error fetching LeetCode Statistics", error);
        } finally {
          setLoadingLeetCode(false);
        }
      } else {
        setError('User ID is missing');
      }
    };

    fetchLeetCodeStats();
  }, [user]);

  return (
    <div className="portfolio-page">
      {/* User Profile Section */}
      <div className="box user-info-box centered">
        <div className="profile-pic-container">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="profile-pic"
          />
        </div>
        <div className="user-name centered-text">
          Welcome, {user ? `${user.first_name} ${user.last_name}` : "Student"}
        </div>
      </div>

      {/* LeetCode Section */}
      <div className="leetcode-box">
        <h2>LeetCode Statistics</h2>
        {loadingLeetCode ? (
          <p>Loading LeetCode statistics...</p>
        ) : error ? (
          <p>{error}</p>
        ) : leetcodeUsername ? (
          <div className="iframe-container">
            <iframe
              src={`${leetcodeBaseURL}${leetcodeUsername}?theme=nord&font=Buenard&ext=activity`}
              title="LeetCode Stats"
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <p>No LeetCode statistics available.</p>
        )}
      </div>

      {/* GitHub Section */}
      <div className="box github-box">
        <h3>GitHub</h3>
        <div className="github-section">
          <div className="github-stats-row">
            <div className="stat-box">
              <label>GitHub Stats</label>
              <img src="https://github-readme-stats.vercel.app/api?username=mariamabdk3m&show_icons=true&theme=radical" alt="GitHub Stats" />
            </div>
            <div className="stat-box">
              <label>GitHub Streak</label>
              <img src="https://github-readme-streak-stats.herokuapp.com/?user=mariamabdk3m&theme=radical" alt="GitHub Streak" />
            </div>
          </div>
          <div className="stat-box">
            <label>Most Used Languages</label>
            <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=mariamabdk3m&layout=compact&theme=radical" alt="Most Used Languages" />
          </div>
          <div className="stat-box">
            <label>Trophies</label>
            <img src="https://github-profile-trophy.vercel.app/?username=mariamabdk3m&theme=radical&no-frame=true&column=7" alt="GitHub Trophies" />
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

export default SupervisorStudentPortfolio;
