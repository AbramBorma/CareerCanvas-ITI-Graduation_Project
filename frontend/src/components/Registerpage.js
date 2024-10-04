import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: '',
    organization: '',
    branch: '',
    track: '',
    linkedin: '',
    github: '',
    hackerrank: '',
    leetcode: ''
  });

  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const roleResponse = await axios.get('http://127.0.0.1:8000/users/roles/');
        const orgResponse = await axios.get('http://127.0.0.1:8000/users/organizations/');
        setRoles(roleResponse.data);
        setOrganizations(orgResponse.data);
      } catch (error) {
        console.error('Error fetching roles and organizations', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.organization) {
      const fetchBranches = async () => {
        try {
          const branchResponse = await axios.get(`http://127.0.0.1:8000/users/branches/?organization=${formData.organization}`);
          setBranches(branchResponse.data);
        } catch (error) {
          console.error('Error fetching branches', error);
        }
      };
      fetchBranches();
    } else {
      setBranches([]); // Clear branches if no organization is selected
      setTracks([]); // Clear tracks as well since branches are cleared
    }
  }, [formData.organization]);

  useEffect(() => {
    if (formData.branch) {
      const fetchTracks = async () => {
        try {
          const trackResponse = await axios.get(`http://127.0.0.1:8000/users/tracks/?branch=${formData.branch}`);
          setTracks(trackResponse.data);
        } catch (error) {
          console.error('Error fetching tracks', error);
        }
      };
      fetchTracks();
    } else {
      setTracks([]); // Clear tracks if no branch is selected
    }
  }, [formData.branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log formData for debugging
    console.log('Form Data:', formData);
  
    let mandatoryFields;
  
    // Condition 1: If role is 'admin'
    if (formData.role === 'admin') {
      console.log('Admin role selected');
      mandatoryFields = ['username', 'email', 'password', 'password2', 'organization', 'branch', 'first_name', 'last_name'];
    } 
    // Condition 2: If role is 'supervisor'
    else if (formData.role === 'supervisor') {
      console.log('Supervisor role selected');
      mandatoryFields = ['username', 'email', 'password', 'password2', 'organization', 'branch', 'track', 'first_name', 'last_name'];
    } 
    // Condition 3: For all other roles, include all fields
    else {
      console.log('Other role selected');
      mandatoryFields = ['username', 'email', 'password', 'password2', 'organization', 'branch', 'track', 'first_name', 'last_name', 'linkedin', 'github', 'hackerrank', 'leetcode'];
    }
  
    // Check for empty mandatory fields
    const emptyFields = mandatoryFields.filter(field => !formData[field]);
  
    if (emptyFields.length > 0) {
      emptyFields.forEach(field => {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} should not be empty`);
      });
      return; // Stop form submission if there are empty fields
    }
  
    // Check if passwords match
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }
  
    try {
      // Register user logic here
      await registerUser(
        formData.email,
        formData.username,
        formData.first_name,
        formData.last_name,
        formData.password,
        formData.password2,
        formData.role,
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
              <input type="text" name="username" id="username" className="input-text" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label htmlFor="first_name">FIRST NAME</label>
              <input type="text" name="first_name" id="first_name" className="input-text" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label htmlFor="last_name">LAST NAME</label>
              <input type="text" name="last_name" id="last_name" className="input-text" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label htmlFor="email">E-MAIL</label>
              <input type="email" name="email" id="email" className="input-text" required onChange={handleChange} />
            </div>

            <div className="form-row">
              <label htmlFor="role">ROLE</label>
              <select name="role" id="role" className="input-text" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.key} value={role.key}>
                    {role.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="organization">ORGANIZATION</label>
              <select name="organization" id="organization" className="input-text" value={formData.organization} onChange={handleChange}>
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
              <select name="branch" id="branch" className="input-text" value={formData.branch} onChange={handleChange} disabled={!formData.organization}>
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
              <select name="track" id="track" className="input-text" value={formData.track} onChange={handleChange} disabled={!formData.branch}>
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
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default RegisterPage;