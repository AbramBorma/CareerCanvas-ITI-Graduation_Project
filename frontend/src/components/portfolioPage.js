import React, { useContext, useEffect, useState } from 'react';
import '../static/styles/PortfolioPage.css';
import AuthContext from '../context/AuthContext';
import { leetCode } from '../services/api';

const PortfolioPage = () => {
  const { user } = useContext(AuthContext);
  const [leetcodeUsername, setLeetCodeUsername] = useState(''); // LeetCode username state
  const [githubUsername, setGithubUsername] = useState(null); // GitHub username state
  const [loadingLeetCode, setLoadingLeetCode] = useState(true);
  const [loadingGitHub, setLoadingGitHub] = useState(true);
  const [error, setError] = useState(null);
  const [lError, setLError] = useState(null);
  const [GError, setGError] = useState(null);
  const leetcodeBaseURL = 'https://leetcard.jacoblin.cool/';


  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      if (user && user.user_id) {
        try {
          setLoadingLeetCode(true);
          setLoadingGitHub(true);
          const data = await leetCode(user.user_id); // Fetch data using the leetCode function
          if (data.leetcode_username) {
            // alert(data.leetcode_username);
            setLeetCodeUsername(data.leetcode_username); // Set the LeetCode username
          } else {
            setLError('No LeetCode statistics available.');
          }
          if (data.github_username) {
            setGithubUsername(data.github_username);
          } else {
            setGError('No GitHub Statistics Available');
          }
        } catch (error) {
          setLError('Failed to fetch LeetCode statistics.');
          console.error("Error fetching LeetCode statistics", error);
          setGError('Failed to fetch GitHub statistics.');
          console.error("Error fetching Github statistics", error);

        } finally {
          setLoadingLeetCode(false);
          setLoadingGitHub(false);
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
        <h1 className="user-name centered-text">
          Welcome, {user ? `${user.first_name} ${user.last_name}!` : "Student"}
        </h1>
      </div>

      {/* LeetCode Section */}
      <div className="leetcode-box">
        <h2>LeetCode Report</h2>
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
        <h2>GitHub Report</h2>
        {githubUsername ? (
          <div className="github-section">
            <div className="github-stats-row">
              <div className="stat-box">
                <label>GitHub Statistics:</label>
                <img src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=nord`} alt="GitHub Stats" />
              </div>
              <div className="stat-box">
                <label>GitHub Streak:</label>
                <img src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=nord`} alt="GitHub Streak" />
              </div>
              <div className="stat-box">
              <label>Most Used Languages:</label>
              <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=nord`} alt="Most Used Languages" />
            </div>
            </div>
          </div>
        ) : (
          <p>Loading GitHub data...</p>
        )}
      </div>

      {/* Skills Progress Section */}
      <div className="box skills-progress-box">
        <h2>Exams Results</h2>
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
