import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import '../static/styles/Auth.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [branches, setBranches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/users/organizations/');
                setOrganizations(response.data);
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };
        fetchOrganizations();
    }, []);

    useEffect(() => {
        const fetchBranches = async () => {
            if (selectedOrganization) {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/users/branches/');
                    setBranches(response.data);
                } catch (error) {
                    console.error("Error fetching branches:", error);
                }
            }
        };
        fetchBranches();
    }, [selectedOrganization]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (selectedBranch) {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/users/courses/');
                    setCourses(response.data);
                } catch (error) {
                    console.error("Error fetching courses:", error);
                }
            }
        };
        fetchCourses();
    }, [selectedBranch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        const registrationData = {
            username,
            email,
            password,
            password2: confirmPassword,
            organization: selectedOrganization,
            branch: selectedBranch,
            course: selectedCourse,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/users/register/', registrationData);
            console.log(response.data);
            navigate('/login'); 
        } catch (error) {
            setErrorMessage('Registration failed. Please try again.');
            console.error(error);
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
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="input-text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-row">
                            <label htmlFor="your_email">E-MAIL</label>
                            <input
                                type="email"
                                name="your_email"
                                id="your_email"
                                className="input-text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-row">
                            <label htmlFor="password">PASSWORD</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="input-text"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-row">
                            <label htmlFor="confirm_password">CONFIRM PASSWORD</label>
                            <input
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                className="input-text"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="organization">ORGANIZATION</label>
                            <select
                                name="organization"
                                id="organization"
                                className="input-text"
                                required
                                value={selectedOrganization}
                                onChange={(e) => setSelectedOrganization(e.target.value)}
                            >
                                <option value="">Select Organization</option>
                                {organizations.map((org) => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <label htmlFor="branch">BRANCH</label>
                            <select
                                name="branch"
                                id="branch"
                                className="input-text"
                                required
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <label htmlFor="course">COURSE</label>
                            <select
                                name="course"
                                id="course"
                                className="input-text"
                                required
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                ))}
                            </select>
                        </div>

                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                        <div className="form-row-last">
                            <input type="submit" name="register" className="register" value="Register" />
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RegisterPage;
