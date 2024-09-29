import React, { useState } from 'react';
import '../static/styles/EditProfile.css';

const EditProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // New state for image upload

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="edit-profile">
      {/* User Profile Section */}
      <div className="box user-info-box">
        <h3>User Profile</h3>
        <div className="profile-pic-section">
          <div className="profile-pic-container">
            <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-pic"
            />
            <div className="change-photo-overlay">
              <label className="change-photo-text">
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                Change profile
              </label>
            </div>
          </div>
          <div className="user-info-fields">
            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email" />
          </div>
        </div>
      </div>

      {/* Dashboard Links Section */}
      <div className="box dashboard-links-box">
        <h3>Dashboard Links</h3>
        <input type="url" placeholder="GitHub" />
        <input type="url" placeholder="LinkedIn" />
        <input type="url" placeholder="LeetCode" />
        <input type="url" placeholder="HackerRank" />
        <button className="progress-btn">Progress</button> {/* New Progress button */}
      </div>

      {/* Skills Section */}
      <div className="box skills-box">
        <h3>Skills</h3>
        <select>
          <option value="">Select Skill</option>
          <option value="skill1">Skill 1</option>
          <option value="skill2">Skill 2</option>
        </select>
      </div>

      {/* Security Section */}
      <div className="box security-box">
        <h3>Security</h3>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Current Password"
          />
          <button onClick={toggleShowPassword} className="show-hide-btn">
            <i className={`fas fa-eye${showPassword ? "" : "-slash"}`}></i>
          </button>
        </div>
        <div className="password-container">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
          />
          <button onClick={toggleShowNewPassword} className="show-hide-btn">
            <i className={`fas fa-eye${showNewPassword ? "" : "-slash"}`}></i>
          </button>
        </div>
      </div>

      {/* Actions (Save & Cancel) */}
      <div className="actions">
        <button className="save-btn">Save</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default EditProfile;
