import React from 'react';
import './cancelSaleConfirmationForm.css';

const CancelSaleConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="confirmation-box">
        <div className="confirmation-header">
          <h3>⚠️ Do you want to cancel this sale?</h3>
        </div>
        <div className="confirmation-actions">
          <button className="confirm-btn" onClick={onConfirm}>Yes</button>
          <button className="cancel-btn" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default CancelSaleConfirmation;
