import React, { useState } from 'react';
import './newCart.css';
import '../ProductSearch/productSearch.css';
import ProductSearch from '../ProductSearch/productSearch.js';
import CartTable from '../CartTable/cartTable.js';
import ActionButtons from '../ActionButtons/actionButtons.js';
import CancelSaleConfirmation from '../Forms/cancelSaleConfirmationForm.js';
import CheckoutForm from '../Forms/checkOutForm.js';


const NewCart = ({ onDiscountClick }) => {
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = useState(false);

  // Handle send button click to open checkout form
  const handleSendClick = () => {
    setIsCheckoutFormOpen(true);
  };

  // Handle close checkout form action
  const handleCloseCheckoutForm = () => {
    setIsCheckoutFormOpen(false);
  };

  // Handle cancel sale button click to open confirmation
  const handleCancelClick = () => {
    setIsCancelConfirmationOpen(true);
  };

  // Handle confirm cancel sale action
  const handleConfirmCancel = () => {
    // Perform cancel sale action here
    console.log('Sale has been cancelled');
    setIsCancelConfirmationOpen(false);
  };

  // Handle close cancel confirmation form
  const handleCloseCancelConfirmation = () => {
    setIsCancelConfirmationOpen(false);
  };

  return (
    <div className="new-cart">
      {/* Product Search and Navigation */}
      <div className="product-search">
        <ProductSearch />
        <button className="send-button" onClick={handleSendClick}>
          Send
        </button>
      </div>
      
      {/* CartTable to display product details */}
      <CartTable />

      {/* Action Buttons with cancel sale action */}
      <ActionButtons handleCancelClick={handleCancelClick} />

      {/* Checkout Form */}
      {isCheckoutFormOpen && (
        <CheckoutForm totalDue={129} onClose={handleCloseCheckoutForm} />
      )}

      {/* Cancel Sale Confirmation Form */}
      {isCancelConfirmationOpen && (
        <CancelSaleConfirmation
          onConfirm={handleConfirmCancel}
          onCancel={handleCloseCancelConfirmation}
        />
      )}
    </div>
  );
};

export default NewCart;
