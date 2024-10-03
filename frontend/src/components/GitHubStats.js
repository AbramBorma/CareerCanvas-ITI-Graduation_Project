// frontend/src/components/GitHubStats.js

import React, {useState, useEffect} from 'react';
import axios from 'axios';

const GitHubStats = () => {
    const [githubUsername, setGithubUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGitHubUsername = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8000/api/get-github-username/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGithubUsername(response.data.github_username);
            } catch (err) {
                setError('Unauthorized or something went wrong.');
            }
        };

        fetchGitHubUsername();
    }, []);

    return (<
            div>
            <
                h1> GitHub Stats < /h1> {
            loading ? (<
                    p> Loading... < /p>
            ) : (<
                        > {
                    githubUsername && < h2> Hello,
                        your GitHub username is {githubUsername} < /h2>} {
                    error && < p style={
                        {color: 'red'}}> {error} < /p>} <
                                    />
            )
        } <
                        /div>
    );
};

export default GitHubStats;