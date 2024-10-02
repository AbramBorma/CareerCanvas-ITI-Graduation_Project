import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import AuthContext
import '../static/styles/PortfolioPage.css';
import hackerrankIcon from '../static/imgs/hackerrank.png';

const PortfolioPage = () => {
  const [githubUsername, setGithubUsername] = useState(null);
  const { user } = useContext(AuthContext); // Get the user context

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
      fetchGitHubUsername();  // Fetch the GitHub username for students
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
          {user?.username}
        </div>
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

      {/* HackerRank Section */}
      <div className="box hackerrank-box">
        <h3>HackerRank</h3>
        <div className="box-content">
          <img src={hackerrankIcon} alt="HackerRank Icon" className="social-icon" />
          <div className="box-divider"></div>  
          <div className="dummy-data enhanced-text">  
            <p>Challenges Completed: <span>50</span></p>
            <p>Rank: <span>3000</span></p>
            <p>Badges Earned: <span>10</span></p>
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
