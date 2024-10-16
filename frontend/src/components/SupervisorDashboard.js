import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/styles/SupervisorDashboard.css'; 
import { 
  getStudents as fetchStudentsFromApi,
  approveStudent as approveStudentFromAPI,
  deleteStudent as deleteStudentFromApi,
  studentPortfolio,
  getSupervisorExams,
  setTrackStudentsExam,
  removeTrackStudentsExam 
} from '../services/api'; 
import AuthContext from '../context/AuthContext'; 
import Dialog from './Dialog'; 
import PaginationRounded from './PaginationComponent'; // Import the pagination component
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { ToastContainer, toast } from 'react-toastify';



const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext); 
  const [students, setStudents] = useState([]); 
  const [subjects, setSubjects] = useState([]);  
  const [selectedSubject, setSelectedSubject] = useState('');  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); 
  const [currentAction, setCurrentAction] = useState(null); 
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const navigate = useNavigate(); 

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); 
  const itemsPerPage = 5;  // Number of students per page

  // Fetch students and subjects when the component mounts or when currentPage changes
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); 
      try {
        const response = await fetchStudentsFromApi(currentPage, searchQuery);  // Pass currentPage and searchQuery to API
        console.log('API response:', response); 
  
        if (response && response.results && response.results.length === 0) {
          setError("There are no students available."); 
        } else if (response && response.results) {
          setStudents(response.results); 
          setTotalItems(response.count);  // Total number of students for pagination
          setError(null); 
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('There are no students available.');
      } finally {
        setLoading(false); 
      }
    };
  
    fetchStudents();
  }, [currentPage, searchQuery]); // Fetch students when currentPage changes

  // Handle pagination page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchExamsSubjects = async () => {
    try {
      const response = await getSupervisorExams(user.user_id);
      setSubjects(response);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Error fetching subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    setDialogOpen(true); 
  };

  const confirmAction = async () => {
    if (currentAction.type === 'approve') {
        // Optimistically update the student's approval status
        setStudents(prevStudents => 
            prevStudents.map(student =>
                student.id === currentAction.id ? { ...student, is_authorized: true } : student
            )
        );

        // Show success notification immediately
        toast.success('Student approved successfully!'); // Notify admin of success

        // Make the API call without waiting for its completion
        handleApprove(currentAction.id).catch(error => {
            console.error('Error approving student:', error);
            // Optionally, handle error by reverting the state if needed
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.id === currentAction.id ? { ...student, is_authorized: false } : student
                )
            );
        });
    } else if (currentAction.type === 'delete') {
        // Optimistically remove student from the state
        setStudents(prevStudents => prevStudents.filter(student => student.id !== currentAction.id));

        // Show success notification immediately
        toast.success('Student deleted successfully!'); // Notify admin of success

        // Make the API call without waiting for its completion
        handleDelete(currentAction.id).catch(error => {
            console.error('Error deleting student:', error);
            // Optionally, handle error by adding the student back if needed
            setStudents(prevStudents => [...prevStudents, { id: currentAction.id }]);
        });
    } else if (currentAction.type === 'remove_exam') {
        // Handle remove exam action without loading
        await handleRemoveExam(); 

        // Show success notification immediately
        toast.success('Exam removed successfully!'); // Notify admin of success
    }

    // Close the dialog immediately
    setDialogOpen(false); 
    setCurrentAction(null); 
};


  const handleApprove = async (id) => {
    try {
        await approveStudentFromAPI(id); 
        // No need to update the state here since it's done in confirmAction
    } catch (error) {
        console.error('Error approving student:', error);
        throw error; // Throw error to handle it in confirmAction
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
        await deleteStudentFromApi(id);
        setStudents(students.filter(student => student.id !== id));
    } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student.'); // Show error toast
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
      await setTrackStudentsExam(supervisorId, { examID: JSON.parse(selectedSubject).id });
      
      // Update the students state to reflect the assigned exam
      setStudents(students.map(student => 
        student.is_authorized ? { ...student, exams: [JSON.parse(selectedSubject).name] } : student
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
      await removeTrackStudentsExam(supervisorId, {  examID: JSON.parse(selectedSubject).id });
      
      // Update the students state to reflect the removed exam
      setStudents(students.map(student => 
        student.is_authorized ? { ...student, exams: [] } : student
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
                <option key={index} value={JSON.stringify(subject)}>
                  {subject.name}
                </option>
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
                  <td data-label="ID: ">{student.id}</td>
                  <td data-label="Student Name: ">{student.full_name}</td>
                  <td data-label="Branch: ">{student.branch}</td>
                  <td data-label="Track: ">{student.track}</td>
                  <td data-label="Assigned Exam: ">
                    {student.exams && student.exams.length > 0 ? student.exams[0] : 'No Exams'}
                  </td>
                  <td data-label="Status: ">{student.is_authorized ? 'Approved' : 'Unapproved'}</td>
                  <td data-label="Actions: ">
                    {!student.is_authorized ? (
                      <>
                        <button className="approve-btn" onClick={() => handleAction('approve', student.id)}>
                          Approve
                        </button>
                        <button className="delete-btn" onClick={() => handleAction('delete', student.id)}>
                          Delete Student
                        </button>
                      </>
                    ) : (
                      <button className="delete-btn" onClick={() => handleAction('delete', student.id)}>
                        Delete Student
                      </button>
                    )}
                  </td>
                  <td data-label="Portfolio">
                    <button className="view-portfolio-btn" onClick={() => handleVisit(student.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          </table>
        </div>
      </div>
      

      {/* Add Pagination */}
      <PaginationRounded
        className="pagination"
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

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
        onConfirm={() => setErrorDialogOpen(false)} 
      />

      {/* Success Dialog */}
      <Dialog
        isOpen={successDialogOpen}  
        title="Success"
        message="Exam removed successfully."
        onClose={() => setSuccessDialogOpen(false)}
        onConfirm={() => setSuccessDialogOpen(false)} 
      />

      <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                draggable 
                pauseOnHover 
      />

    </div>
  );
};

export default SupervisorDashboard;