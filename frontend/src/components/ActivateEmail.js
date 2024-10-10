import React from 'react';

const ActivateEmail = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Email Verification Required</h2>
        <p style={styles.message}>
          Please check your email to verify your account. Follow the instructions in the email to activate your account.
        </p>
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
};

export default ActivateEmail;
