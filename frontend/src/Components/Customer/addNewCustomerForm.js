import React, { useState } from 'react';
import './customer.css';

const AddCustomerForm = ({ onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSaveCustomer = async () => {
    // Create a new customer object
    const newCustomer = {
      custFName: firstName,
      custMName: middleName,
      custLName: lastName,
      custEmail: email,
      custAddr: address,
      custBalance: 0.0, // Assuming initial balance is 0
    };

    try {
      // Send a POST request to the backend API to save the new customer
      const response = await fetch('http://localhost:8082/api/regular/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        console.log('Customer added successfully');
        onClose();
      } else {
        console.error('Error adding customer:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  return (
    <div className="add-customer-form">
      <div className="form-header">
        <h3>Add New Customer</h3>
        <span className="close-btn" onClick={onClose}>❌</span>
      </div>
      <div className="form-body">
        <div className="form-row">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Middle Name:</label>
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button onClick={handleSaveCustomer} className="save-btn">Save</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerForm;
