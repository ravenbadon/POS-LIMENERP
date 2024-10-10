import React, { useState } from 'react';
import './discountForm.css'; // Add your styles here

const DiscountForm = ({ subtotal, onSave, onClose }) => {
  const [discount, setDiscount] = useState('');
  const [percentage, setPercentage] = useState('');

  const handleSave = () => {
    onSave(discount, percentage);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="discount-form">
        <div className="discount-header">
          <h2>Discount</h2>
          <button className="close-btn" onClick={onClose}>❌</button>
        </div>
        <div className="discount-body">
          <label>
            Subtotal:
            <input type="text" value={`₱${subtotal}`} disabled />
          </label>
          <label>
            Discount:
            <input
              type="text"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </label>
          <label>
            Percentage:
            <input
              type="text"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
          </label>
        </div>
        <div className="discount-footer">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
