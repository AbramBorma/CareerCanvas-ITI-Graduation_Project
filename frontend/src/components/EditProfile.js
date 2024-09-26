import React, { useState } from 'react';
import '../static/styles/EditProfile.css';

const EditProfile = () => {
  const [profileImageUrl, setProfileImageUrl] = useState('https://via.placeholder.com/150');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
    }
  };

  return (
    <div className="edit-profile">
      <div className="user-info-box">
        <h3>User Profile</h3>
        <div className="profile-pic-container">
          <img className="profile-pic" src={profileImageUrl} alt="Profile" />
          <div className="change-photo-overlay">
            <label htmlFor="image-upload" className="change-photo-btn">
              Change photo
            </label>
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
          </div>
        </div>
        <input type="text" placeholder="Username" />
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
      </div>

      <div className="dashboard-links-box">
        <h3>Dashboard Links</h3>
        <input type="url" placeholder="GitHub" />
        <input type="url" placeholder="LinkedIn" />
        <input type="url" placeholder="LeetCode" />
        <input type="url" placeholder="HackerRank" />
      </div>

      <div className="skills-box">
        <h3>Skills</h3>
        <select>
          <option value="">Select skill</option>
          {/* Add other skill options here */}
        </select>
      </div>

      <div className="security-box">
        <h3>Security</h3>
        <div className="password-container">
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Current Password" 
          />
          <button 
            className="show-hide-btn" 
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="password-container">
          <input 
            type={showNewPassword ? 'text' : 'password'} 
            placeholder="New Password" 
          />
          <button 
            className="show-hide-btn" 
            onClick={() => setShowNewPassword(!showNewPassword)}>
            {showNewPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="actions">
        <button className="save-btn">Save</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default EditProfile;