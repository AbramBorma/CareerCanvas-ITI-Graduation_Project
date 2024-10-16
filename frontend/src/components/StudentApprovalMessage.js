// src/components/ApprovalMessage.js
import React from 'react';

const StudentApprovalMessage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Awaiting Supervisor Approval</h2>
        <p style={styles.message}>
          Your request is pending. Please wait for your supervisor's approval.
          If you need assistance, feel free to contact your supervisor.
        </p>
        <div style={styles.contact}>
          <p>
            Supervisor Email: 
            <a href="mailto:minanagy@hotmail.com" style={styles.link}>
              supervisor@example.com
            </a>
          </p>
          <p>
            Supervisor Phone: 
            <a href="tel:+1234567890" style={styles.link}>
              +1 (234) 567-890
            </a>
          </p>
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
  link: {
    color: '#3498db', // Professional blue color for links
    textDecoration: 'none',
    fontWeight: 'bold', // Make links bolder
    transition: 'color 0.3s', // Smooth color transition on hover
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

export default StudentApprovalMessage;
