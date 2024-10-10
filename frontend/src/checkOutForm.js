import React, { useState } from 'react';
import './checkOutForm.css';

const CheckoutForm = ({ totalDue, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [saveAsDebt, setSaveAsDebt] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(false);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (name === 'saveAsDebt') {
      setSaveAsDebt(checked);
    } else if (name === 'printReceipt') {
      setPrintReceipt(checked);
    }
  };

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log('Payment Method:', paymentMethod);
    console.log('Save as Debt:', saveAsDebt);
    console.log('Print Receipt:', printReceipt);
    console.log('Total Due:', totalDue);
    onClose();
  };

  return (
    <div className="checkout-form">
      <div className="checkout-header">
        <h2>Total Due</h2>
        <h3>₱{totalDue}</h3>
        <span className="close-btn" onClick={onClose}>❌</span>
      </div>
      <div className="payment-methods">
        <button 
          className={`payment-btn ${paymentMethod === 'cash' ? 'active' : ''}`} 
          onClick={() => handlePaymentMethodChange('cash')}
        >
          💵 Cash
        </button>
        <button 
          className={`payment-btn ${paymentMethod === 'ewallet' ? 'active' : ''}`} 
          onClick={() => handlePaymentMethodChange('ewallet')}
        >
          💳 E-Wallet
        </button>
      </div>
      <div className="checkout-options">
        <label>
          <input
            type="checkbox"
            name="saveAsDebt"
            checked={saveAsDebt}
            onChange={handleCheckboxChange}
          />
          Save as debt
        </label>
        <label>
          <input
            type="checkbox"
            name="printReceipt"
            checked={printReceipt}
            onChange={handleCheckboxChange}
          />
          Print receipt
        </label>
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CheckoutForm;