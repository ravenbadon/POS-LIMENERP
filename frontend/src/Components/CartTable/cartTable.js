import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './cartTable.css';

const CartTable = ({ cartItems }) => {
  const columns = [
    { field: 'prodNo', headerName: 'Product ID', width: 150 },
    { field: 'prodName', headerName: 'Product Name', width: 200 },
    { field: 'prodBrand', headerName: 'Brand', width: 150 },
    { field: 'prodPrice', headerName: 'Price', width: 150}
  ];

  return (
    <div className='data-grid'>
      <DataGrid 
        rows={cartItems.map((item) => ({ 
            id: item.prodNo,
            prodNo: item.prodNo,
            prodName: item.prodName,
            prodBrand: item.prodBrand, 
            prodPrice: item.prodPrice
          }))}
        columns={columns} 
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default CartTable;
