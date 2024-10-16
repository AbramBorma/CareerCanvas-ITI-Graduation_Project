import React, { useEffect, useState } from 'react';
import '../static/styles/PortfolioPage.css';
import { leetCode, examsResults } from '../services/api';
import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material'; // Material-UI components


const SupervisorStudentPortfolio = () => {

    const [leetcodeUsername, setLeetCodeUsername] = useState(''); // LeetCode username state
    const [githubUsername, setGithubUsername] = useState(null); // GitHub username state
    const [examResults, setExamsResults] = useState([]); // Exam results state (array)
    const [loadingLeetCode, setLoadingLeetCode] = useState(true);
    const [loadingGitHub, setLoadingGitHub] = useState(true);
    const [loadingResults, setLoadingResults] = useState(true);
    const [error, setError] = useState(null);
    const [lError, setLError] = useState(null);
    const [GError, setGError] = useState(null);
    const [RError, setRError] = useState(null);
    const leetcodeBaseURL = 'https://leetcard.jacoblin.cool/';

    function getPathParams() {
      const urlParts = window.location.pathname.split('/'); // Split the URL by '/'
      const fullName = decodeURIComponent(urlParts[urlParts.length - 2]); // Get the second last part of the path and decode it
      const studentId = urlParts[urlParts.length - 1]; // Get the last part of the path
  
      return { fullName, studentId }; // Return both values as an object
  }
  
  // Usage
    const { fullName, studentId } = getPathParams(); // This will return { fullName: 'Abram Raouf', studentId: '15' }
    console.log(fullName, studentId);

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      if (studentId) {
        try {
          setLoadingLeetCode(true);
          setLoadingGitHub(true);
          const data = await leetCode(studentId); // Fetch data using the leetCode function
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
    const fetchExamsResults = async () => {
      try {
        setLoadingResults(true);
        const response = await examsResults(studentId); // Fetch exam results using the user ID
        if (response && response.exams) {
          setExamsResults(response.exams); // Set the fetched exam results
        } else {
          setRError('No Exams Results Available');
        }
      } catch (err) {
        setRError('Failed to fetch exams results.');
      } finally {
        setLoadingResults(false);
      }
    };

    fetchLeetCodeStats();
    fetchExamsResults();
  }, [studentId]);

    const getProgressBarClass = (score) => {
      if (score >= 75) return 'progress-high';
      if (score >= 50) return 'progress-medium';
      return 'progress-low';
    };

  return (
    <div className="portfolio-page">

      <div className="box welcome">
        <h1>{`${fullName} Portfolio`}</h1>
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

      {/* Exams Results Section */}
      <div className="box exams-progress-box">
        <h2>Exams Results</h2>
        {loadingResults ? (
          <p>Loading exam results...</p>
        ) : RError ? (
          <p>{RError}</p>
        ) : examResults.length > 0 ? (
          examResults.map((exam, index) => (
            <Card key={index} className="exam-card" variant="outlined">
              <CardContent>
                <Typography variant="h4" component="div">
                  {exam.subject_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Exam Date: {new Date(exam.date_taken).toLocaleString()}
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Box width="100%" mr={1}>
                    <LinearProgress
                      variant="determinate"
                      value={exam.score} // Exam score for the progress
                      className={getProgressBarClass(exam.score)} // Add dynamic class for color
                    />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">{`${Math.round(exam.score)}%`}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No exam results available.</p>
        )}
      </div>
    </div>
  );
};

export default SupervisorStudentPortfolio;
