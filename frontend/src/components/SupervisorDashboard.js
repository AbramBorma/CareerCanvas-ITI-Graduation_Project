import React, { useState } from 'react';
import '../static/styles/SupervisorDashboard.css'; 


const SupervisorDashboard = () => {

  
      // Initialize searchResults with two dummy records
  const [searchResults, setSearchResults] = useState([
    {
      id: "S12345",
      name: "John Doe",
      email: "johndoe@example.com",
      track: "Full-Stack Development",
      examStatus: "Passed",
    },
    {
      id: "S67890",
      name: "Jane Smith",
      email: "janesmith@example.com",
      track: "Data Science",
      examStatus: "Pending",
    },
  ]);

 // Function to approve student (set status to 'Active')
const approveStudent = (index) => {
  const updatedResults = [...searchResults];
  updatedResults[index].status = 'Active';
  setSearchResults(updatedResults);
};

// Function to deactivate student (set status to 'Inactive')
const deactivateStudent = (index) => {
  const updatedResults = [...searchResults];
  updatedResults[index].status = 'Inactive';
  setSearchResults(updatedResults);
};
  


    // Function to delete a student
    const deleteStudent = (studentId) => {
      // Filter out the student by ID
      const updatedStudents = searchResults.filter(
        (student) => student.id !== studentId
      );
      setSearchResults(updatedStudents); // Update state with filtered results
    };
    
   

    
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
  {/* Welcome Message for Supervisors */}
  <div className="welcome-message">
    <h2>Welcome, Supervisor!</h2>
    <p>Manage student records and set exams with ease.</p>
  </div>

  {/* Search and Filter Section */}
  <div className="search-filter-section">
    <h3>Approve Students and Set Exams</h3>

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
    <button className="set-exam-btn">Set Exam for Selected Track</button>
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
        <th>Phone</th>
        <th>Exam Status</th>
       
        <th>Status</th> {/* Status column */}
        <th>Approval</th> {/* Approval column */}
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
       
          <td className={student.status === 'Active' ? 'status-active' : 'status-inactive'}>
            {/* Show Active/Inactive status */}
            {student.status ? student.status : 'Inactive'}
          </td>
          <td>
            {/* Approval and Deactivation buttons */}
            <button
              className="approve-btn"
              onClick={() => approveStudent(index)} // Call approve function
            >
              Approve
            </button>
            <button
              className="deactivate-btn"
              onClick={() => deactivateStudent(index)} // Call deactivate function
            >
              Deactivate
            </button>
          </td>
          <td>
            <button
              className="delete-btn"
              onClick={() => deleteStudent(student.id)} // Call delete function
            >
              Delete Student
            </button>
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