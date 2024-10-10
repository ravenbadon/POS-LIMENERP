import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './cartTable.css';

// Exporting columns and rows so they can be reused elsewhere
export const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'productName', headerName: 'Product Name', width: 200 },
  { field: 'quantity', headerName: 'Quantity', width: 130 },
  { field: 'price', headerName: 'Price', width: 130 },
  { field: 'total', headerName: 'Total', width: 130 }
];

export const rows = [
  { id: 1, productName: 'Product 1', quantity: 2, price: 10, total: 20 },
  { id: 2, productName: 'Product 2', quantity: 5, price: 8, total: 40 },
  { id: 3, productName: 'Product 3', quantity: 1, price: 15, total: 15 },
  { id: 4, productName: 'Product 4', quantity: 3, price: 12, total: 36 }
];

const CartTable = () => {
  return (
    <div className='data-grid'>
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

export default CartTable;
