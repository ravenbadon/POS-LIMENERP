import React, { useState } from 'react';
import './customer.css';
import AddCustomerForm from './addNewCustomerForm.js'; // Form to add a new customer
import CustomerTable from './customerTable.js';

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
        <input //must be able to search customer names
          type="text"
          className="search-customer-input"
          placeholder="Search customer" 
        />
      </div>
      <div className="customer-list">
        {/* Customer list or table */}
        <CustomerTable />
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
