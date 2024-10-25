import React from 'react';
import './actionButtons.css';

const ActionButtons = ({ handleCancelClick }) => {
  return (
    <div className="action-buttons">
      <button className="cancel-button" onClick={handleCancelClick}>
        Cancel Sale
      </button>
      <div className="total-display">
        <span>Total:</span>
        <span>$0.00</span>
      </div>
    </div>
  );
};

export default ActionButtons;
