import React, { useState } from 'react';

const ProductSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);

    // Handle input change and fetch products
    const handleInputChange = async (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.length > 0) {
            try {
                const response = await fetch(`http://localhost:8081/api/products/search?query=${term}`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error("Error fetching products:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        } else {
            setProducts([]); // Clear the results when search term is empty
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
