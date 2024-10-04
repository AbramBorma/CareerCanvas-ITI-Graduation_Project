import React from 'react';
import '../static/styles/Dialog.css';

const Dialog = ({ isOpen, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null; // Do not render if dialog is not open

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-buttons">
          {onConfirm ? ( // Conditional rendering for confirmation actions
            <>
              <button className="cancel-button" onClick={onClose}>Cancel</button>
              <button className="confirm-button" onClick={onConfirm}>Confirm</button>
            </>
          ) : (
            <button className="ok-button" onClick={onClose}>OK</button> // OK button for error messages
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
