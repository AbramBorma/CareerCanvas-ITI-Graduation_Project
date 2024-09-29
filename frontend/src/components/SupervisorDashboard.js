import React, { useState } from 'react';
import '../static/styles/SupervisorDashboard.css'; 


const SupervisorDashboard = () => {

  
    const [searchResults, setSearchResults] = useState([]);

    
   

    
  return (
    <div className="supervisor-dashboard">
      {/* Top Navigation Bar */}
      <div className="top-navbar">
        <h2>Supervisor Dashboard</h2>
        <div className="user-profile">
          <img src="profile-image-url" alt="User Profile" className="profile-pic" />
        </div>
      </div>

      {/* Main Section */}
      <div className="main-section">
      {/* Search and Filter Section */}
  <div className="search-filter-section">
    <h3>Search Students and Set Exams</h3>
    
    {/* Search Bar for Students */}
    <div className="student-search">
      <label>Search Student by Name:</label>
      <input type="text" placeholder="Enter student name..." />
    </div>

    {/* Track Selection Dropdown */}
    <div className="track-filter">
     
      <select>
        <option>Select Track</option>
        {/* Track options will be populated here */}
      </select>
    </div>

    {/* Button to Fetch Students of Selected Track */}
    <button className="fetch-students-btn">Get Students of Selected Track</button>

    {/* Exam Selection Dropdown */}
    <div className="exam-selection">
    
      <select>
        <option>Select Exam</option>
        {/* Exam options will be populated here */}
      </select>
    </div>

    {/* Button to Set Exam */}
    <button className="set-exam-btn">Set Exam for Selected Student</button>
  </div>

      {/* Student Records Table */}
  <div className="student-list">
    <h3>Student Records</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Student Name</th>
          <th>Email</th>
          <th>Track</th>
          <th>Phone Number</th>
          <th>Exam Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Dynamically render students from search results */}
        {searchResults.map((student, index) => (
          <tr key={index}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.track}</td>
            <td>{student.phone}</td>
            <td>{student.examStatus}</td>
            <td>
              <button className="delete-btn">Delete Student</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
