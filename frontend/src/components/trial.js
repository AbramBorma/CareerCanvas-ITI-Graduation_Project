import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/styles/SupervisorDashboard.css'; 
import { getStudents as fetchStudentsFromApi,
        approveStudent as approveStudentFromAPI,
        deleteStudent as deleteStudentFromApi,
        studentPortfolio,
        examSubjects,
        setTrackStudentsExam,
        removeTrackStudentsExam } from '../services/api'; 
import AuthContext from '../context/AuthContext';
import ResponsiveDialog from './Confirmation'; // Import ResponsiveDialog

const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext); 
  const [students, setStudents] = useState([]); 
  const [subjects, setSubjects] = useState([]);  
  const [selectedSubject, setSelectedSubject] = useState('');  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');  
  const [dialogMessage, setDialogMessage] = useState(''); 
  const [isDialogOpen, setDialogOpen] = useState(false);  // Manage dialog open/close
  const [selectedStudent, setSelectedStudent] = useState(null); // Using this to track the selected student ID for the API
  const navigate = useNavigate(); 

  // Fetch students and subjects when the component mounts
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

    const fetchExamsSubjects = async () => {
      try {
        const response = await examSubjects();
        setSubjects(response);  
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Error fetching subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
    fetchExamsSubjects();
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

  // Delete student (using your API logic)
  const handleDelete = async (id) => {
    try {
        alert(id);
        await deleteStudentFromApi(id);  // No selectedStudentId or user ID
        setStudents(students.filter(student => student.id !== id));
        console.log(students);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
    setDialogOpen(false); // Close dialog after deletion
  };

  // Open the delete confirmation dialog
  const openDeleteDialog = () => {
    setDialogTitle('Confirm Delete');  
    setDialogMessage('Are you sure you want to delete this student?');  
    setDialogOpen(true);  // Open the dialog
  };

  // Handle visit button click
  const handleVisit = async (studentId) => {
    try {
      const portfolioData = await studentPortfolio(studentId);
      if (portfolioData) {
        navigate(`/portfolio/${portfolioData.full_name}/${portfolioData.id}`); 
      }
    } catch (error) {
      console.error("Error fetching student portfolio:", error);
      alert("Failed to fetch the student's portfolio.");
    }
  };

  // Handle Set Exam
  const handleSetExam = async () => {
    try {
      if (!selectedSubject) {
        alert('Please select an exam subject.');
        return;
      }
      const supervisorId = user.user_id;  
      const examSubject = await setTrackStudentsExam(supervisorId, { subject: selectedSubject });
    } catch (error) {
      console.error("Error setting the exam:", error);
    }
  };

  const handleRemoveExam = async () => {
    try {
      if (!selectedSubject) {
        alert('Please select an exam subject.');
        return;
      }
      const supervisorId = user.user_id;  
      const confirmRemoveExam = window.confirm("Are you sure you want to Unassign this exam for the whole track?")
      if (confirmRemoveExam) {
        const examSubject = await removeTrackStudentsExam(supervisorId, { subject: selectedSubject });
      }
    } catch (error) {
      console.error("Error setting the exam:", error);
    }
  };

  return (
    <div className="supervisor-dashboard">
      {/* Top Navigation Bar */}
      <div className="top-navbar">
        <h2>Supervisor Dashboard</h2>
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

          {/* Exam Selection Dropdown */}
          <div className="exam-selection">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select Exam</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Button to Set Exam */}
          <button
            className="set-exam-btn"
            onClick={handleSetExam}
          >
            Set Exam
          </button>
          <button
            className="unset-exam-btn"
            onClick={handleRemoveExam}
          >
            Remove Exam
          </button>
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
                  <td colSpan="8">Loading students...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8">{error}</td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.id}</td>
                    <td>{student.full_name}</td>
                    <td>{student.branch}</td>
                    <td>{student.track}</td>
                    <td>{ student.exams && student.exams.length > 0 ? student.exams[0] : 'No Exams' }</td>
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
                          {/* Insert ResponsiveDialog instead of delete button */}
                          <ResponsiveDialog
                              title="Confirm Delete"
                              message="Are you sure you want to delete this student?"
                              agreeText="Confirm"
                              disagreeText="Cancel"
                              onConfirm={handleDelete}
                              onClose={() => setDialogOpen(false)}
                              open={isDialogOpen && selectedStudent === student.id} // Ensure it only opens for the correct student
                              onClick={() => openDeleteDialog(student.id)} // Open dialog for this student
                          />
                        </>
                      ) : (
                        <ResponsiveDialog
                        title="Confirm Delete"
                        message="Are you sure you want to delete this student?"
                        agreeText="Confirm"
                        disagreeText="Cancel"
                        onConfirm={handleDelete}
                        onClose={() => setDialogOpen(false)}
                        onClick={() => openDeleteDialog(student.id)} // Open dialog for this student
                    />
                      )}
                    </td>
                    <td>
                      {student.is_active ? (
                        <button className="visit-btn" onClick={() => handleVisit(student.id)}>
                          Visit
                        </button>
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
