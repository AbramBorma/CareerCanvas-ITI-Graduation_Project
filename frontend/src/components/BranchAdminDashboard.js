import React, { useEffect, useState, useContext } from 'react';
import '../static/styles/organizationdashboard.css';
import Navbar from "./NavBar";
import Footer from './Footer';
import Dialog from './Dialog'; // Import Dialog component
import { getSupervisors as fetchSupervisorsFromApi, approveSupervisor as approveSupervisorFromApi, deleteSupervisor as deleteSupervisorFromApi } from "../services/api"; 
import AuthContext from '../context/AuthContext';  // Import AuthContext

const OrganizationDashboard = () => {
  const { user } = useContext(AuthContext);  // Get user from context
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '', onConfirm: null });

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

  // Approve supervisor
  const handleApprove = (id) => {
    openDialog(
      "Approve Supervisor",
      "Are you sure you want to approve this supervisor?",
      async () => {
        try {
          await approveSupervisorFromApi(id); 
          setSupervisors(supervisors.map(supervisor =>
            supervisor.id === id ? { ...supervisor, is_active: true } : supervisor
          ));
        } catch (error) {
          console.error('Error approving supervisor:', error);
        } finally {
          closeDialog();
        }
      }
    );
  };

  // Delete supervisor
  const handleDelete = (id) => {
    openDialog(
      "Delete Supervisor",
      "Are you sure you want to delete this supervisor?",
      async () => {
        try {
          await deleteSupervisorFromApi(id); 
          setSupervisors(supervisors.filter(supervisor => supervisor.id !== id));
        } catch (error) {
          console.error('Error deleting supervisor:', error);
        } finally {
          closeDialog();
        }
      }
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
        <section className="admin-table">
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
                      <td>{supervisor.id}</td>
                      <td>{`${supervisor.first_name} ${supervisor.last_name}`}</td>
                      <td>{supervisor.branch}</td>
                      <td>{supervisor.is_active ? 'Active' : 'Inactive'}</td>
                      <td>
                        {!supervisor.is_active && (
                          <button className="btn-approve" onClick={() => handleApprove(supervisor.id)}>
                            Approve
                          </button>
                        )}
                        <button className="btn-delete" onClick={() => handleDelete(supervisor.id)} style={{ backgroundColor: 'red', color: 'white' }}>
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
        </section>
      </div>
      
      {/* Dialog Component */}
      <Dialog
        isOpen={dialogOpen}
        title={dialogContent.title}
        message={dialogContent.message}
        onConfirm={dialogContent.onConfirm}
        onClose={closeDialog}
      />
    </>
  );
};

export default OrganizationDashboard;
