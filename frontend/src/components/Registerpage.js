import React, { useState, useContext, useEffect } from 'react';
import '../static/styles/Auth.css';
import Navbar from './NavBar';
import Footer from './Footer';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    organization: '',
    branch: '',
    track: '',
    linkedin: '',
    github: '',
    hackerrank: '',
    leetcode: ''
  });

  const [organizations, setOrganizations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tracks, setTracks] = useState([]);

  // Fetching organizations, branches, and tracks from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgResponse = await axios.get('http://127.0.0.1:8000/users/organizations/');
        const branchResponse = await axios.get('http://127.0.0.1:8000/users/branches/');
        const trackResponse = await axios.get('http://127.0.0.1:8000/users/courses/'); 

        setOrganizations(orgResponse.data);
        setBranches(branchResponse.data);
        setTracks(trackResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(
        formData.email,
        formData.username,
        formData.password,
        formData.password2,
        formData.organization,
        formData.branch,
        formData.track,
        formData.linkedin,
        formData.github,
        formData.hackerrank,
        formData.leetcode
      );
      navigate('/login');
    } catch (error) {
      console.error('Error registering user', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="form-v7-content">
          <div className="form-left">
            <p className="text-1">Sign Up</p>
          </div>
          <form className="form-detail" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="username">USERNAME</label>
              <input type="text" name="username" id="username" className="input-text" onChange={handleChange} />
            </div>
            <div className="form-row">
              <label htmlFor="email">E-MAIL</label>
              <input type="email" name="email" id="email" className="input-text" required onChange={handleChange} />
            </div>

            <div className="form-row">
              <label htmlFor="organization">ORGANIZATION</label>
              <select
                name="organization"
                id="organization"
                className="input-text"
                value={formData.organization}
                onChange={handleChange}
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="branch">BRANCH</label>
              <select
                name="branch"
                id="branch"
                className="input-text"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="track">TRACK</label>
              <select
                name="track"
                id="track"
                className="input-text"
                value={formData.track}
                onChange={handleChange}
              >
                <option value="">Select Track</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="linkedin">LinkedIn</label>
              <input type="text" name="linkedin" id="linkedin" className="input-text" onChange={handleChange} />
            </div>
            <div className="form-row">
              <label htmlFor="github">GitHub</label>
              <input type="text" name="github" id="github" className="input-text" onChange={handleChange} />
            </div>
            <div className="form-row">
              <label htmlFor="hackerrank">HackerRank</label>
              <input type="text" name="hackerrank" id="hackerrank" className="input-text" onChange={handleChange} />
            </div>
            <div className="form-row">
              <label htmlFor="leetcode">LeetCode</label>
              <input type="text" name="leetcode" id="leetcode" className="input-text" onChange={handleChange} />
            </div>

            <div className="form-row password-container">
              <label htmlFor="password">PASSWORD</label>
              <input type="password" name="password" id="password" className="input-text" required onChange={handleChange} />
            </div>
            <div className="form-row password-container">
              <label htmlFor="confirm_password">CONFIRM PASSWORD</label>
              <input type="password" name="password2" id="confirm_password" className="input-text" required onChange={handleChange} />
            </div>
            <div className="form-row-last">
              <input type="submit" name="register" className="register" value="Sign Up" />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RegisterPage;
