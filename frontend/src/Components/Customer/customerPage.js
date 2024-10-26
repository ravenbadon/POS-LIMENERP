import React, { useState } from 'react';
import './customer.css';
import AddCustomerForm from './addNewCustomer.js'; // Form to add a new customer

const CustomerPage = () => {
  const [isAddCustomerFormOpen, setIsAddCustomerFormOpen] = useState(false);


  // Handle opening the "Add Customer" form
  const handleAddCustomerClick = () => {
    setIsAddCustomerFormOpen(true);
  };

  // Handle closing the "Add Customer" form
  const handleCloseAddCustomerForm = () => {
    setIsAddCustomerFormOpen(false);
  };

  return (
    <div className="customer-page">
      <div className="customer-controls">
        <button className="add-customer-btn" onClick={handleAddCustomerClick}>Add Customer</button>
        <input
          type="text"
          className="search-customer-input"
          placeholder="Search customer"
        />
      </div>
      <div className="customer-list">
        {/* Customer list or table will go here */}
        {/* This could be implemented as another component, similar to CartTable */}
      </div>

      {/* Add Customer Form */}
      {isAddCustomerFormOpen && (
        <div className="modal-overlay">
          <AddCustomerForm onClose={handleCloseAddCustomerForm} />
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
