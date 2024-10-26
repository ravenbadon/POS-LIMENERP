import React, { useState } from 'react';
import './App.css';
import TabNavigation from './Components/TabNavigation/tabNavigation.js'; //renaming
import NewCart from './Components/NewCart/newCart.js';
import CustomerPage from './Components/Customer/customerPage.js';
import DiscountForm from './Components/Forms/discountForm';

function App() {
  const [activePage, setActivePage] = useState('checkout'); // Track active page
  const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false); // Discount form visibility

  // Handle navigation tab clicks
  const handleTabClick = (page) => {
    setActivePage(page);
  };

  // Handle opening and closing the discount form
  const handleOpenDiscountForm = () => {
    setIsDiscountFormOpen(true);
  };

  const handleCloseDiscountForm = () => {
    setIsDiscountFormOpen(false);
  };

  return (
    <div className="center-wrapper">
      <header className="header">
        <h1>LIMEN POS System</h1>
      </header>
      <div className="main-wrapper">
      {/* Navigation Bar */}
      <TabNavigation
        activePage={activePage}
        onTabClick={handleTabClick}
        onDiscountClick={handleOpenDiscountForm} // Trigger discount form
      />
      
      <div className="App">
          {/* Render NewCart or CustomerPage based on the activePage state */}
          {activePage === 'checkout' && <NewCart />}
          {activePage === 'customer' && <CustomerPage />}

          {/* Render Discount Form as Modal */}
          {isDiscountFormOpen && (
            <DiscountForm
              subtotal={100}
              onSave={(discount, percentage) => console.log('Discount saved', discount, percentage)}
              onClose={handleCloseDiscountForm}
            />
          )}
      </div>
      </div>

    </div>
  );
}

export default App;
