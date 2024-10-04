import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/styles/SupervisorDashboard.css'; 
import { 
  getStudents as fetchStudentsFromApi,
  approveStudent as approveStudentFromAPI,
  deleteStudent as deleteStudentFromApi,
  studentPortfolio,
  examSubjects,
  setTrackStudentsExam,
  removeTrackStudentsExam 
} from '../services/api'; 
import AuthContext from '../context/AuthContext'; 
import Dialog from './Dialog'; // Import the Dialog component

const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext); 
  const [students, setStudents] = useState([]); 
  const [subjects, setSubjects] = useState([]);  
  const [selectedSubject, setSelectedSubject] = useState('');  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog open state
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // Error dialog open state
  const [currentAction, setCurrentAction] = useState(null); // Track current action
  const navigate = useNavigate(); 
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); 


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

  // Handle actions for approving and deleting
  const handleAction = (action, id) => {
    setCurrentAction({ type: action, id });
    setDialogOpen(true); // Open dialog
  };

  // Confirm action from dialog
  const confirmAction = async () => {
    if (currentAction.type === 'approve') {
      await handleApprove(currentAction.id);
    } else if (currentAction.type === 'delete') {
      await handleDelete(currentAction.id);
    } else if (currentAction.type === 'remove_exam') {
      await handleRemoveExam(); // Handle removing exam
    }
    setDialogOpen(false); // Close dialog after action
    setCurrentAction(null); // Reset current action
  };

  const handleApprove = async (id) => {
    try {
      await approveStudentFromAPI(id); 
      setStudents(students.map(student =>
        student.id === id ? { ...student, is_active: true } : student
      ));
    } catch (error) {
      console.error('Error approving student:', error);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteStudentFromApi(id); 
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSetExam = async () => {
    try {
      if (!selectedSubject) {
        setErrorDialogOpen(true);
        return;
      }
      const supervisorId = user.user_id;
      await setTrackStudentsExam(supervisorId, { subject: selectedSubject });
      
      // Update the students state to reflect the assigned exam
      setStudents(students.map(student => 
        student.is_active ? { ...student, exams: [selectedSubject] } : student
      ));
      
    } catch (error) {
      console.error("Error setting the exam:", error);
    }
  };

  const handleRemoveExam = async () => {
    if (!selectedSubject) {
      setErrorDialogOpen(true);
      return;
    }
    
    try {
      const supervisorId = user.user_id;
      await removeTrackStudentsExam(supervisorId, { subject: selectedSubject });
      
      // Update the students state to reflect the removed exam
      setStudents(students.map(student => 
        student.is_active ? { ...student, exams: [] } : student
      ));
      
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error("Error removing the exam:", error);
    }
  };
  

  return (
    <div className="supervisor-dashboard">
      <div className="top-navbar">
        <h2>Supervisor Dashboard</h2>
      </div>

      <div className="main-section">
        <div className="welcome-message">
          Welcome, {user ? `${user.first_name} ${user.last_name}` : 'Admin'}!
          <p>Manage student records and set exams with ease.</p>
        </div>

        <div className="search-filter-section">
          <h3>Approve Students and Set Exams</h3>
          <div className="student-search">
            <label>Search Student by Name:</label>
            <input
              type="text"
              placeholder="Enter student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
                    <td>{student.exams && student.exams.length > 0 ? student.exams[0] : 'No Exams'}</td>
                    <td>{student.is_active ? 'Active' : 'Inactive'}</td>
                    <td>
                      {!student.is_active ? (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => handleAction('approve', student.id)} // Use the dialog
                          >
                            Approve
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleAction('delete', student.id)} // Use the dialog
                          >
                            Delete Student
                          </button>
                        </>
                      ) : (
                        <button
                          className="delete-btn"
                          onClick={() => handleAction('delete', student.id)} // Use the dialog
                        >
                          Delete Student
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className="view-portfolio-btn"
                        onClick={() => handleVisit(student.id)}
                      >
                        View Portfolio
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={dialogOpen}
        title={currentAction ? `${currentAction.type.charAt(0).toUpperCase() + currentAction.type.slice(1)} Student` : ''}
        message={currentAction ? (
          currentAction.type === 'approve' 
            ? 'Are you sure you want to approve this student?' 
            : currentAction.type === 'delete' 
            ? 'Are you sure you want to delete this student?' 
            : 'Are you sure you want to remove the exam?'
        ) : ''}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmAction}
      />

      {/* Error Dialog */}
      <Dialog
        isOpen={errorDialogOpen}
        title="Error"
        message="Please select an exam to proceed."
        onClose={() => setErrorDialogOpen(false)}
        onConfirm={() => setErrorDialogOpen(false)} // Close the error dialog
      />

      {/* Success Dialog */}
       <Dialog
        isOpen={successDialogOpen}  // Ensure this uses successDialogOpen
        title="Success"
        message="Exam removed successfully."
        onClose={() => setSuccessDialogOpen(false)}
        onConfirm={() => setSuccessDialogOpen(false)} // Close the success dialog
      />

      
    </div>
  );
};

export default SupervisorDashboard;
