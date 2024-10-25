import React from 'react';
import './controls.css';

function Controls() {
  const handleAddToCart = () => {
    // Handle add to cart logic
    console.log('Add to Cart clicked');
  };

  const handleCancelSale = () => {
    // Handle cancel sale logic
    console.log('Cancel Sale clicked');
  };

  const handleCheckout = () => {
    // Handle checkout logic
    console.log('Checkout clicked');
  };

  return (
    <div className="controls-container">
      <div className="control-item">
        <input type="text" placeholder="Search product" />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
      <div className="control-item">
        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        <button className="cancel-sale-btn" onClick={handleCancelSale}>Cancel Sale</button>
      </div>
    </div>
  );
}

export default Controls;
