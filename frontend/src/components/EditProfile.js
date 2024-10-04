import React, { useState, useEffect } from 'react';
import { updateProfileData, getProfileData, getAuthToken } from '../services/api'; // Import your API functions
import '../static/styles/EditProfile.css';

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    github: '',
    linkedin: '',
    leetcode: '',
    hackerrank: ''
  });
  
  const [loading, setLoading] = useState(true); // Loading state
  const token = getAuthToken(); // Get token from localStorage or any auth context

  // Fetch profile data when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfileData(); // Get current profile data
        setProfileData(data); // Set profile data to state
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (token) {
      fetchData();
    } else {
      console.warn("No token found for fetching profile data.");
    }
  }, [token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      await updateProfileData(profileData); // Send updated profile data
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="edit-profile">
      {/* User Profile Section */}
      <div className="box user-info-box">
        <h3>User Profile</h3>
        <div className="profile-pic-section">
          <div className="profile-pic-container">
            {/* Profile Picture Can Be Added Here */}
          </div>
          <div className="user-info-fields">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={profileData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={profileData.first_name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={profileData.last_name}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Dashboard Links Section */}
      <div className="box dashboard-links-box">
        <h3>Portfolio Links</h3>
        <input
          type="url"
          name="github"
          placeholder="GitHub"
          value={profileData.github}
          onChange={handleInputChange}
        />
        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn"
          value={profileData.linkedin}
          onChange={handleInputChange}
        />
        <input
          type="url"
          name="leetcode"
          placeholder="LeetCode"
          value={profileData.leetcode}
          onChange={handleInputChange}
        />
        <input
          type="url"
          name="hackerrank"
          placeholder="HackerRank"
          value={profileData.hackerrank}
          onChange={handleInputChange}
        />
      </div>

      {/* Save Button */}
      <div className="actions">
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default EditProfile;
