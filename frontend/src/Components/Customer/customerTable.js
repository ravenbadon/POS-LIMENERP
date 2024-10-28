import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './customer.css';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customers from the backend
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8082/api/regular');
        if (response.ok) {
          const data = await response.json();
          // Map each customer to add an `id` field using `custNo`
          const customersWithId = data.map((customer) => ({
            id: customer.custNo, // Use `custNo` as a unique id for DataGrid
            custLName: customer.custLName,
            custFName: customer.custFName,
            custAddr: customer.custAddr,
            custBalance: customer.custBalance,
          }));
          setCustomers(customersWithId);
        } else {
          setError("Error fetching customers: " + response.statusText);
        }
      } catch (error) {
        setError("Error fetching customers: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Define columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'custLName', headerName: 'Last Name', width: 200 },
    { field: 'custFName', headerName: 'First Name', width: 200 },
    { field: 'custAddr', headerName: 'Address', width: 200 },
    { field: 'custBalance', headerName: 'Balance', width: 200 },
  ];

  return (
    <div className="customer-table">
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <DataGrid
        rows={customers}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default CustomerTable;
