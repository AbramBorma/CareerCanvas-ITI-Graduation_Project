import React, { useEffect, useState, useContext } from 'react';
import '../static/styles/organizationdashboard.css';
import Navbar from "./NavBar";
import Footer from './Footer';
import { getSupervisors as fetchSupervisorsFromApi, approveSupervisor as approveSupervisorFromApi, deleteSupervisor as deleteSupervisorFromApi } from "../services/api"; 
import AuthContext from '../context/AuthContext';  // Import AuthContext

const OrganizationDashboard = () => {
  const { user } = useContext(AuthContext);  // Get user from context
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Approve supervisor
  const handleApprove = async (id) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this supervisor?");
    if (confirmApprove) {
      try {
        await approveSupervisorFromApi(id); 
        setSupervisors(supervisors.map(supervisor =>
          supervisor.id === id ? { ...supervisor, is_active: true } : supervisor
        ));
      } catch (error) {
        console.error('Error approving supervisor:', error);
      }
    }
  };

  // Delete supervisor
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supervisor?");
    if (confirmDelete) {
      try {
        await deleteSupervisorFromApi(id); 
        setSupervisors(supervisors.filter(supervisor => supervisor.id !== id));
      } catch (error) {
        console.error('Error deleting supervisor:', error);
      }
    }
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
      <Footer />
    </>
  );
};

export default OrganizationDashboard;
