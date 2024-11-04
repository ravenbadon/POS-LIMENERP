import React, { useState, useEffect } from 'react';
import './productSearch.css';

const ProductSearch = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8082/api/product');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError("Error fetching products: " + response.statusText);
        }
      } catch (error) {
        setError("Error fetching products: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    setDebounceTimeout(setTimeout(() => {
      filterProducts(term);
    }, 300));
  };

  const filterProducts = (term) => {
    if (term.length === 0) {
      setFilteredProducts([]);
      setIsDropdownVisible(false);
    } else {
      const filtered = products.filter(product =>
        product.prodName.toLowerCase().includes(term.toLowerCase()) ||
        product.prodBrand.toLowerCase().includes(term.toLowerCase()) ||
        product.prodSKU.toLowerCase().includes(term.toLowerCase()) ||
        product.prodBarcode.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsDropdownVisible(filtered.length > 0);
    }
  };

  // Handle selecting a product from the dropdown
  const handleProductClick = (product) => {
    onAddToCart(product); // Add product to the cart
    setSearchTerm(''); // Clear search term
    setFilteredProducts([]);
    setIsDropdownVisible(false);
  };

  return (
    <div className="product-search">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for products"
        onFocus={() => filteredProducts.length > 0 && setIsDropdownVisible(true)}
        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {isDropdownVisible && (
        <div className="dropdown-container">
          <ul className="product-list">
            {filteredProducts.map((product) => (
              <li key={product.prodNo} onClick={() => handleProductClick(product)}>
                {product.prodBarcode} | {product.prodName} | {product.prodBrand} | {product.prodSKU}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
