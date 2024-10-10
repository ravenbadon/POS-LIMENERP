import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './customer.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'customerName', headerName: 'Customer Name', width: 200 },
  { field: 'contact', headerName: 'Contact', width: 150 },
];

const rows = [
  { id: 1, customerName: 'John Doe', contact: '123-456-7890' },
  { id: 2, customerName: 'Jane Smith', contact: '098-765-4321' },
];

const CustomerTable = () => {
  return (
    <div className="customer-table">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default CustomerTable;
