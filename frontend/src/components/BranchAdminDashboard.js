import React, { useEffect, useState, useContext } from 'react';
import '../static/styles/organizationdashboard.css';
import Navbar from "./NavBar";
import Footer from './Footer';
import Dialog from './Dialog'; // Import Dialog component
import { getSupervisors as fetchSupervisorsFromApi, approveSupervisor as approveSupervisorFromApi, deleteSupervisor as deleteSupervisorFromApi } from "../services/api"; 
import AuthContext from '../context/AuthContext';  // Import AuthContext
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const OrganizationDashboard = () => {
  const { user } = useContext(AuthContext);  // Get user from context
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '', onConfirm: null });
  const [currentAction, setCurrentAction] = useState(null); // New state for current action

  // Fetch supervisors on component mount
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetchSupervisorsFromApi();  
        setSupervisors(response.supervisors);
      } catch (err) {
        console.error('Error fetching supervisors:', err);
        setError('Error fetching supervisors');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSupervisors();
  }, []);

  // Filter supervisors based on search query
  const filteredSupervisors = searchQuery
    ? supervisors.filter(supervisor =>
        `${supervisor.first_name} ${supervisor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : supervisors;

  // Open the dialog
  const openDialog = (title, message, onConfirm) => {
    setDialogContent({ title, message, onConfirm });
    setDialogOpen(true);
  };

  // Close the dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Optimistic approval of the supervisor
  const confirmAction = async () => {
    if (!currentAction) {
      console.error('No action selected');
      return;
    }
    
    if (currentAction.type === 'approve') {
      // Optimistically update the supervisor's approval status
      setSupervisors(prevSupervisors => 
        prevSupervisors.map(supervisor =>
          supervisor.id === currentAction.id ? { ...supervisor, is_authorized: true } : supervisor
        )
      );
  
      // Show success notification immediately
      toast.success('Supervisor approved successfully!'); // Notify admin of success
  
      // Make the API call without waiting for its completion
      handleApprove(currentAction.id).catch(error => {
        console.error('Error approving supervisor:', error);
        // Optionally, handle error by reverting the state if needed
        setSupervisors(prevSupervisors =>
          prevSupervisors.map(supervisor =>
            supervisor.id === currentAction.id ? { ...supervisor, is_authorized: false } : supervisor
          )
        );
      });
    } else if (currentAction.type === 'delete') {
      // Delete supervisor
      try {
        await deleteSupervisorFromApi(currentAction.id);
        setSupervisors(prevSupervisors => 
          prevSupervisors.filter(supervisor => supervisor.id !== currentAction.id)
        );
        toast.success('Supervisor deleted successfully!');
      } catch (error) {
        console.error('Error deleting supervisor:', error);
        toast.error('Failed to delete supervisor.');
      }
    }
  
    closeDialog(); // Close the dialog immediately
    setCurrentAction(null); 
  };

  // Approve supervisor
  const handleApprove = async (id) => {
    try {
      await approveSupervisorFromApi(id); 
      // No need to update the state here since it's done in confirmAction
    } catch (error) {
      console.error('Error approving supervisor:', error);
      throw error; // Throw error to handle it in confirmAction
    }
  };

  // Delete supervisor
  const handleDelete = (id) => {
    setCurrentAction({ type: 'delete', id });  // Set current action as delete
    openDialog(
      "Delete Supervisor",
      "Are you sure you want to delete this supervisor?",
      confirmAction  // Pass the confirm action
    );
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="welcome-message">Welcome, {user ? `${user.first_name} ${user.last_name}` : 'Admin'}!</div> {/* Display full name */}

        {/* Search bar */}
        <section className="search-bar">
          <input
            type="text"
            placeholder="Search Supervisor by Full Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </section>

        {/* Supervisors Table */}
        <div className="admin-table">
          <h2>Supervisors</h2>
          {loading ? (
            <p>Loading supervisors...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupervisors.length > 0 ? (
                  filteredSupervisors.map(supervisor => (
                    <tr key={supervisor.id}>
                      <td data-label="ID: ">{supervisor.id}</td>
                      <td data-label="Full Name: ">{`${supervisor.first_name} ${supervisor.last_name}`}</td>
                      <td data-label="Branch: ">{supervisor.branch}</td>
                      <td data-label="Status: ">{supervisor.is_authorized ? 'Approved' : 'Unapproved'}</td>
                      <td data-label="Actions: ">
                        {!supervisor.is_authorized && (
                          <button
                            className="btn-approve"
                            onClick={() => {
                              setCurrentAction({ type: 'approve', id: supervisor.id });
                              openDialog(
                                "Approve Supervisor",
                                "Are you sure you want to approve this supervisor?",
                                confirmAction // Set confirm action to the dialog
                              );
                            }}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(supervisor.id)}
                          style={{ backgroundColor: 'red', color: 'white' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No supervisors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialog Component */}
      <Dialog
        isOpen={dialogOpen}
        title={dialogContent.title}
        message={dialogContent.message}
        onConfirm={confirmAction} // Confirm action
        onClose={closeDialog}
      />

      {/* Toast Container for Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick draggable pauseOnHover />
      
    </>
  );
};

export default OrganizationDashboard;
