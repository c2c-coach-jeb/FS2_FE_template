import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import NavBar from "../components/nav";
import Product from "../components/product";

const Shopping = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/products`
        );
        setProducts(data.rows);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, product);
    console.log("Add to cart response:", response);
    navigate("/cart");
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "";
    }

    return typeof price === "number" ? currencyFormatter.format(price) : price;
  };

  const renderProducts = () => (
    <>
      <div id="shopping">
        {isLoading && <p>Loading products...</p>}
        {error && <p>{error}</p>}
        {!isLoading && !error && products.length === 0 && (
            <h2>No products available at the moment.</h2>
        )}
        {!isLoading && !error &&
          products.map((product) => (
            <div className="card" key={product.id}>
                <Product product = {product} />
                <button onClick={() => addToCart(product)}> Add to Cart </button>
            </div>
          ))}
      </div>
    </>
  );

  return (
    <div className="main">
      {renderProducts()}
    </div>
  );
};

export default Shopping;
