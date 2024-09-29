import React, { useState } from 'react';
import './organizationdashboard.css';


const OrganizationDashboard = () => {
  // State for managing admins
  const [admins, setAdmins] = useState([
    { id: 1, track: 'Open-Source', supervisor: 'Mina Nagy', status: 'Active' },
    { id: 2, track: 'Cybersecurity', supervisor: 'Ahmed', status: 'Inactive' }
  ]);

  // Predefined list of supervisors
  const supervisors = ['Mina Nagy', 'Ahmed', 'Omar Mosleh', 'Yahya Momtaz'];

  // State for the selected supervisor
  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  // Function to handle creating a new admin
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!selectedSupervisor) {
      alert("Please select a supervisor.");
      return;
    }

    // Add new admin to the list
    const newAdmin = {
      id: admins.length + 1,
      track: 'N/A',   // As no track selection remains
      supervisor: selectedSupervisor,
      status: 'Active'
    };

    setAdmins([...admins, newAdmin]);

    // Reset the supervisor dropdown
    setSelectedSupervisor('');
  };

  // Remove admin by ID
  const handleRemove = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  return (
    <div className="dashboard">
      {/* Form Section */}
      <section className="add-admin-form">
        <h2>Add a New Admin</h2>
        <form onSubmit={handleCreateAdmin}>
          <div className="form-group">
            <label htmlFor="supervisor">Select Supervisor:</label>
            <select
              id="supervisor"
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              className="input-field"
            >
              <option value="">-- Select Supervisor --</option>
              {supervisors.map((supervisor, index) => (
                <option key={index} value={supervisor}>{supervisor}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-submit">+ Create</button>
        </form>
      </section>

      {/* Admins Table */}
      <section className="admin-table">
        <h2>Admins</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Track</th>
              <th>Supervisor Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.track}</td>
                <td>{admin.supervisor}</td>
                <td>{admin.status}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleRemove(admin.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
};

export default OrganizationDashboard;
