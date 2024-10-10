import React from 'react';
import './tabNavigation.css';

const TabNavigation = ({ activePage, onTabClick, onDiscountClick }) => {
  return (
    <div className="tab-navigation">
      <button
        className={`tab-button ${activePage === 'checkout' ? 'active' : ''}`}
        onClick={() => onTabClick('checkout')}
      >
        Checkout
      </button>
      <button
        className={`tab-button ${activePage === 'customer' ? 'active' : ''}`}
        onClick={() => onTabClick('customer')}
      >
        Customer
      </button>
      {/* Discount button triggers popup form, not a new page */}
      <button 
        className="tab-button" 
        onClick={onDiscountClick}
      >
        Discount
      </button>
    </div>
  );
};

export default TabNavigation;
