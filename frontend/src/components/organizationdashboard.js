import React from 'react';
import './organizationdashboard.css'; 

const OrganizationDashboard = () => {
  return (
    <div className="dashboard">
      {/* Header Section */}
      <header>
        <input type="search" placeholder="Search..." className="search-bar" />
        <div className="profile">
          <img src="profile.jpg" alt="Profile" />
        </div>
      </header>

      {/* Form Section */}
      <section className="add-pos-form">
        <h2>Add a New Admin</h2>
        <form>
          <div className="form-group">
            <label htmlFor="branch">Select Branch:</label>
            <select id="branch">
              <option>Select Branch</option>
              {/* Add options dynamically */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="supervisor">Select Supervisor:</label>
            <select id="supervisor">
              <option>Select Supervisor</option>
              {/* Add options dynamically */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="track">Select Track:</label>
            <select id="track">
              <option>Select Track</option>
              {/* Add options dynamically */}
            </select>
          </div>
          <button type="submit" className="btn-submit">+ Create New POS</button>
        </form>
      </section>

      {/* Points of Sale Table */}
      <section className="pos-table">
        <h2>Admins</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Branch Name</th>
              <th>POS Name</th>
              <th>API Key</th>
              <th>Supervisor Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Static data for now, but can be dynamic later */}
            <tr>
              <td>1</td>
              <td>New Capital Branch</td>
              <td>POS1</td>
              <td>fZOTlqvG26Y...</td>
              <td>Mina Nagy</td>
              <td>Active</td>
              <td>
                <button className="btn-delete">Delete POS</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Second Branch</td>
              <td>POS2</td>
              <td>fJPO42KS52...</td>
              <td>Ahmed</td>
              <td>Inactive</td>
              <td>
                <button className="btn-delete">Delete POS</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OrganizationDashboard;
