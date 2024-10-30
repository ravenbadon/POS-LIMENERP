import React, { useState, useEffect } from 'react'; //searchbar is working

const ProductSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
        // Fetch all products on initial load
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
            filterProducts(term);
        }, 300)); // 300ms debounce delay
    };

    // Filter products based on search term
    const filterProducts = (term) => {
        if (term.length === 0) {
            setFilteredProducts([]);
            setIsDropdownVisible(false); // Hide dropdown when input is empty
        } else {
            const filtered = products.filter(product =>
                product.prodName.toLowerCase().includes(term.toLowerCase()) ||
                product.prodBrand.toLowerCase().includes(term.toLowerCase()) ||
                product.prodSKU.toLowerCase().includes(term.toLowerCase()) ||
                product.prodBarcode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredProducts(filtered);
            setIsDropdownVisible(filtered.length > 0); // Show dropdown only if there are matches
        }
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
                            <li key={product.prodNo} onClick={() => setSearchTerm(product.prodName)}>
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
