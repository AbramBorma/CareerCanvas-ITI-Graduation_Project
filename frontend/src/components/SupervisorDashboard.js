import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this line is present
import '../static/styles/SupervisorDashboard.css'; 
import { getStudents as fetchStudentsFromApi, approveStudent as approveStudentFromAPI, deleteStudent as deleteStudentFromApi, studentPortfolio } from '../services/api'; 
import AuthContext from '../context/AuthContext'; 

const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext); 
  const [students, setStudents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Fetch students when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetchStudentsFromApi(); 
        setStudents(response.students); 
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Error fetching students');
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudents();
  }, []);

  // Filter students based on search query
  const filteredStudents = searchQuery
    ? students.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  // Approve student
  const handleApprove = async (id) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this student?");
    if (confirmApprove) {
      try {
        await approveStudentFromAPI(id); 
        setStudents(students.map(student =>
          student.id === id ? { ...student, is_active: true } : student
        ));
      } catch (error) {
        console.error('Error approving student:', error);
      }
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      try {
        await deleteStudentFromApi(id); 
        setStudents(students.filter(student => student.id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  // Handle visit button click
  const handleVisit = async (studentId) => {
    try {
      // Fetch student portfolio using the API
      const portfolioData = await studentPortfolio(studentId);
      if (portfolioData) {
        // Redirect to the student's portfolio page
        alert(portfolioData.full_name);
        navigate(`/portfolio/${portfolioData.full_name}/${portfolioData.id}`); // Assuming the API returns the student ID
      }
    } catch (error) {
      console.error("Error fetching student portfolio:", error);
      alert("Failed to fetch the student's portfolio.");
    }
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
        <div className="welcome-message">
          Welcome, {user ? `${user.first_name} ${user.last_name}` : 'Admin'}!
          <p>Manage student records and set exams with ease.</p>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <h3>Approve Students and Set Exams</h3>

          {/* Search Bar for Students */}
          <div className="student-search">
            <label>Search Student by Name:</label>
            <input
              type="text"
              placeholder="Enter student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Button to Fetch Students of Selected Track */}
          <button className="fetch-students-btn">Get Student</button>

          {/* Exam Selection Dropdown */}
          <div className="exam-selection">
            <select>
              <option>Select Exam</option>
              {/* Exam options will be populated here */}
            </select>
          </div>

          {/* Button to Set Exam */}
          <button className="set-exam-btn">Set Exam</button>
        </div>

        {/* Student Records Table */}
        <div className="student-list">
          <h3>Student Records</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Branch</th>
                <th>Track</th>
                <th>Assigned Exam</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading students...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7">{error}</td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.id}</td>
                    <td>{student.full_name}</td>
                    <td>{student.branch}</td>
                    <td>{student.track}</td>
                    <td>{student.exam}</td>
                    <td>{student.is_active ? 'Active' : 'Inactive'}</td>
                    <td>
                      {!student.is_active ? (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => handleApprove(student.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete Student
                          </button>
                        </>
                      ) : (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete Student
                        </button>
                      )}
                    </td>
                    <td>
                      {student.is_active ? (
                        <button className="visit-btn"onClick={() => handleVisit(student.id)}>Visit</button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
