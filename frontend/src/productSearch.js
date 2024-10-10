import React from 'react';
import './productSearch.css';

const ProductSearch = () => {
  return (
    <div className="product-search-container">
      <input type="text" placeholder="Search product" className="product-search-input" />
      <select className="product-search-dropdown">
        <option value="">Select</option>
        {/* Populate with product categories or other options */}
      </select>
    </div>
  );
};

export default ProductSearch;
