import React, { useState } from 'react';
import './organizationdashboard.css';

const OrganizationDashboard = () => {
  // State for managing admin requests (Pending Approval)
  const [adminRequests, setAdminRequests] = useState([
    { id: 1, fullname: 'Mina Nagy', branch: 'Open Source', status: 'Pending' },
    { id: 2, fullname: 'Ahmed', branch: 'Mobile App', status: 'Pending' }
  ]);

  // State for managing search
  const [searchQuery, setSearchQuery] = useState('');

  // Filter admins by search query
  const filteredAdmins = adminRequests.filter((admin) =>
    admin.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to approve admin request
  const handleApprove = (id) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this request?");
    if (confirmApprove) {
      setAdminRequests(adminRequests.map(admin =>
        admin.id === id ? { ...admin, status: 'Active' } : admin
      ));
    }
  };

  // Function to decline admin request
  const handleDecline = (id) => {
    const confirmDecline = window.confirm("Are you sure you want to decline this request?");
    if (confirmDecline) {
      setAdminRequests(adminRequests.filter(admin => admin.id !== id));
    }
  };

  // Function to remove admin
  const handleRemove = (id) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this admin?");
    if (confirmRemove) {
      setAdminRequests(adminRequests.filter(admin => admin.id !== id));
    }
  };

  // Function to deactivate admin
  const handleDeactivate = (id) => {
    const confirmDeactivate = window.confirm("Are you sure you want to deactivate this admin?");
    if (confirmDeactivate) {
      setAdminRequests(adminRequests.map(admin =>
        admin.id === id ? { ...admin, status: 'Inactive' } : admin
      ));
    }
  };

  // Function to activate admin
  const handleActivate = (id) => {
    const confirmActivate = window.confirm("Are you sure you want to activate this admin?");
    if (confirmActivate) {
      setAdminRequests(adminRequests.map(admin =>
        admin.id === id ? { ...admin, status: 'Active' } : admin
      ));
    }
  };

  return (
    <div className="dashboard">
      {/* Welcome Message */}
      <div className="welcome-message">Welcome, Admin!</div>

      {/* Search bar */}
      <section className="search-bar">
        <input
          type="text"
          placeholder="Search Admin by Fullname..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
        />
      </section>

      {/* Admins Table */}
      <section className="admin-table">
        <h2>Admin Requests</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fullname</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.fullname}</td>
                  <td>{admin.branch}</td>
                  <td>{admin.status}</td>
                  <td>
                    {admin.status === 'Pending' ? (
                      <>
                        <button className="btn-approve" onClick={() => handleApprove(admin.id)}>
                          Approve
                        </button>
                        <button className="btn-decline" onClick={() => handleDecline(admin.id)}>
                          Decline
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-delete" onClick={() => handleRemove(admin.id)}>
                          Remove
                        </button>
                        {admin.status === 'Inactive' ? (
                          <button className="btn-activate" onClick={() => handleActivate(admin.id)}>
                            Activate
                          </button>
                        ) : (
                          <button className="btn-deactivate" onClick={() => handleDeactivate(admin.id)}>
                            Deactivate
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No admin requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OrganizationDashboard;
