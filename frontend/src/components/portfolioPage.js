import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import AuthContext
import React, { useContext, useEffect, useState } from 'react';
import '../static/styles/PortfolioPage.css';
import AuthContext from '../context/AuthContext';
import { leetCode } from '../services/api';

const PortfolioPage = () => {
  const { user } = useContext(AuthContext);
  const [leetcodeUsername, setLeetCodeUsername] = useState(''); // LeetCode username state
  const [githubUsername, setGithubUsername] = useState(null); // GitHub username state
  const [loadingLeetCode, setLoadingLeetCode] = useState(true);
  const [error, setError] = useState(null);
  const leetcodeBaseURL = 'https://leetcard.jacoblin.cool/';


  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      if (user && user.user_id) {
        try {
          setLoadingLeetCode(true);
          const data = await leetCode(user.user_id); // Fetch data using the leetCode function
          if (data.username) {
            setLeetCodeUsername(data.username); // Set the LeetCode username
          } else {
            setError('No LeetCode statistics available.');
          }
        } catch (error) {
          setError('Failed to fetch LeetCode statistics.');
          console.error("Error fetching LeetCode statistics", error);
        } finally {
          setLoadingLeetCode(false);
        }
      } else {
        setError('User ID is missing');
      }
    };

    fetchLeetCodeStats();
  }, [user]);

  useEffect(() => {
    const fetchGitHubUsername = async () => {
      try {
        const response = await fetch('/portfolio/github-stats/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setGithubUsername(data.github_username);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching GitHub username:", error);
      }
    };

    if (user && user.role === 'student') {
      fetchGitHubUsername(); // Fetch the GitHub username for students
    }
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
        {githubUsername ? (
          <div className="github-section">
            <div className="github-stats-row">
              <div className="stat-box">
                <label>GitHub Stats</label>
                <img src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=radical`} alt="GitHub Stats" />
              </div>
              <div className="stat-box">
                <label>GitHub Streak</label>
                <img src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=radical`} alt="GitHub Streak" />
              </div>
            </div>
            <div className="stat-box">
              <label>Most Used Languages</label>
              <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=radical`} alt="Most Used Languages" />
            </div>
          </div>
        ) : (
          <p>Loading GitHub data...</p>
        )}
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
