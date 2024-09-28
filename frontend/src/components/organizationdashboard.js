import React, { useState } from 'react';
import './organizationdashboard.css';

const OrganizationDashboard = () => {
  // State for managing admins
  const [admins, setAdmins] = useState([
    { id: 1, branch: 'New Capital Branch', track: 'Open-Source', supervisor: 'Mina Nagy', status: 'Active' },
    { id: 2, branch: 'Smart Village', track: 'Cybersecurity', supervisor: 'Ahmed', status: 'Inactive' }
  ]);

  // List of branches
  const branches = [
    'Smart Village', 'New Capital', 'Cairo University', 'Alexandria', 'Assiut', 'Aswan',
    'Beni Suef', 'Fayoum', 'Ismailia', 'Mansoura', 'Menofia', 'Minya', 'Qena', 'Sohag'
  ];

  // List of tracks
  const tracks = [
    'Open Source Applications Development',
    'Cloud Platform Development',
    'Enterprise & Web Apps Development (Java)',
    'Mobile Applications Development (Native)',
    'Professional Development & BI-infused CRM',
    'Web & User Interface Development',
    'Telecom Applications Development',
    'Mobile Applications Development (Cross Platform)',
    'Integrated Software Development & Architecture'
  ];

  // State for form input
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [supervisorName, setSupervisorName] = useState(''); 

  // Function to handle creating a new admin
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!selectedBranch || !selectedTrack || !supervisorName) {
      alert("Please select a branch, track, and supervisor.");
      return;
    }

    // Add new admin to the list
    const newAdmin = {
      id: admins.length + 1,
      branch: selectedBranch,
      track: selectedTrack,
      supervisor: supervisorName,
      status: 'Active'
    };

    setAdmins([...admins, newAdmin]);

    // Reset the form fields
    setSelectedBranch('');
    setSelectedTrack('');
    setSupervisorName('');
  };

  // Remove admin by ID
  const handleRemove = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header>
        <input type="search" placeholder="Search..." className="search-bar" />
        <div className="profile">
          <img src="admin.png" alt="Profile" />
        </div>
      </header>

      {/* Form Section */}
      <section className="add-pos-form">
        <h2>Add a New Admin</h2>
        <form onSubmit={handleCreateAdmin}>
          <div className="form-group">
            <label htmlFor="branch">Select Branch:</label>
            <select
              id="branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="track">Select Track:</label>
            <select
              id="track"
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
            >
              <option value="">Select Track</option>
              {tracks.map(track => (
                <option key={track} value={track}>{track}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="supervisor">Supervisor Name:</label>
            <input
              type="text"
              id="supervisor"
              value={supervisorName}
              onChange={(e) => setSupervisorName(e.target.value)}
              placeholder="Enter Supervisor Name"
            />
          </div>
          <button type="submit" className="btn-submit">+ Create</button>
        </form>
      </section>

      {/* Admins Table */}
      <section className="pos-table">
        <h2>Admins</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Branch Name</th>
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
                <td>{admin.branch}</td>
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
