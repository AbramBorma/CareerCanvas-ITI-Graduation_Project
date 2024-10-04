import React, { useEffect } from 'react';
import '../static/styles/Dialog.css';

const Dialog = ({ isOpen, title, message, onConfirm, onClose }) => {
  
  // Accessibility: Trap focus inside the dialog when open
  useEffect(() => {
    if (isOpen) {
      const dialogElement = document.querySelector('.dialog');
      dialogElement.focus(); // Focus on the dialog when it opens
    }
  }, [isOpen]);

  if (!isOpen) return null; // Do not render if dialog is not open

  // Close dialog when clicking on the overlay
  const handleOverlayClick = (e) => {
    if (e.target.className === 'dialog-overlay') {
      onClose();
    }
  };

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div className="dialog" tabIndex="-1"> {/* Allow focus for accessibility */}
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
