import React, { useState } from 'react';

const ProductSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    // Handle input change and debounce fetch products
    const handleInputChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        // Clear previous debounce timer
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new debounce timer
        setDebounceTimeout(setTimeout(() => {
            fetchProducts(term);
        }, 300)); // 300ms debounce delay
    };

    // Fetch products based on the search term
    const fetchProducts = async (term) => {
        if (term.length > 0) {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8082/api/product/search?query=${term}`);
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
        } else {
            setProducts([]); // Clear the results when search term is empty
            setIsLoading(false);
        }
    };

    return (
        <div className="product-search">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search for products"
            />
            {isLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {products.length > 0 && (
                <ul className="product-list">
                    {products.map((product) => (
                        <li key={product.prodNo}>
                            {product.prodName} - {product.prodBrand} - {product.prodSKU}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductSearch;
