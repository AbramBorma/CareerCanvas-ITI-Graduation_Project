// src/components/AdminApprovalMessage.js
import React from 'react';

const AdminApprovalMessage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Waiting for Admin Approval</h2>
        <p style={styles.message}>
          Your account is pending approval. Please wait for the superuser's approval before accessing the admin dashboard.
        </p>
        <div style={styles.contact}>
          <p>If you have any questions, please contact your superuser.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    backgroundColor: '#ecf0f1', // Light gray background for contrast
  },
  card: {
    backgroundColor: '#fff', // White card background
    padding: '40px', // Increased padding for a more spacious feel
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', // Enhanced shadow for depth
    maxWidth: '600px', // Slightly larger max width for the card
    textAlign: 'center',
    animation: 'fadeIn 0.5s', // Fade-in animation for smoother entry
    transition: 'transform 0.3s', // Smooth transition on hover
  },
  title: {
    color: '#2c3e50', // Darker shade for the title
    fontSize: '32px', // Increased font size for the title
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  message: {
    color: '#7f8c8d', // Subtle gray for the message text
    fontSize: '20px', // Increased font size for better readability
    lineHeight: '1.5', // Improved line height for readability
    marginBottom: '30px',
  },
  contact: {
    fontSize: '18px', // Increased font size for contact info
    color: '#34495e',
  },
};

// Animation keyframes for fade-in effect
const fadeIn = {
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-20px)', // Slide in from above
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

export default AdminApprovalMessage;
