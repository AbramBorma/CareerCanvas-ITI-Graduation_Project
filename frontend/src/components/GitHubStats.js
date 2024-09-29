import React, { useState } from 'react';

function GitHubStats() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`/api/github-stats/?username=${username}`);
      const text = await response.text(); // Get raw text instead of JSON
      console.log("Response text:", text); // Print response for debugging
  
      if (response.ok) {
        const data = JSON.parse(text); // Try parsing the text as JSON
        setUserData(data);
      } else {
        setError('Something went wrong');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Error fetching data');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter GitHub username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />
        <button type="submit">Get Stats</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {userData && (
        <div>
          <h2>{userData.username}'s GitHub Stats</h2>
          <img src={`https://github-readme-stats.vercel.app/api?username=${userData.username}&show_icons=true&theme=radical`} alt="GitHub Stats" />
          <img src={`https://github-readme-streak-stats.herokuapp.com/?user=${userData.username}&theme=radical`} alt="GitHub Streak" />
          <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${userData.username}&layout=compact&theme=radical`} alt="Most Used Languages" />
          <img src={`https://github-profile-trophy.vercel.app/?username=${userData.username}&theme=radical&no-frame=true&column=7`} alt="GitHub Trophies" />
        </div>
      )}
    </div>
  );
}

export default GitHubStats;
