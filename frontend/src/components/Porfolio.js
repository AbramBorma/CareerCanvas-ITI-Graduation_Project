import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = ({ username }) => {
    const [githubData, setGithubData] = useState(null);
    const [hackerrankData, setHackerrankData] = useState(null);

    useEffect(() => {
        axios.get(`/api/github/${username}/`)
            .then(response => setGithubData(response.data))
            .catch(error => console.log(error));

        axios.get(`/api/hackerrank/${username}/`)
            .then(response => setHackerrankData(response.data))
            .catch(error => console.log(error));
    }, [username]);

    return (
        <div>
            <h1>Portfolio for {username}</h1>
            <div>
                <h2>GitHub Repos</h2>
                {githubData ? githubData.map(repo => (
                    <div key={repo.repo_name}>
                        <p>{repo.repo_name}</p>
                        <p>{repo.languages.join(', ')}</p>
                    </div>
                )) : <p>Loading GitHub data...</p>}
            </div>

            <div>
                <h2>HackerRank Data</h2>
                {hackerrankData ? (
                    <div>
                        <p>Easy: {hackerrankData.solved_stats.easy}</p>
                        <p>Medium: {hackerrankData.solved_stats.medium}</p>
                        <p>Hard: {hackerrankData.solved_stats.hard}</p>
                        <p>Latest Solved: {hackerrankData.latest_solved.join(', ')}</p>
                    </div>
                ) : <p>Loading HackerRank data...</p>}
            </div>
        </div>
    );
}

export default Portfolio;
