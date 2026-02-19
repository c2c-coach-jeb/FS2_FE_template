import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/nav";
import Product from "../components/product";

const PAGE_PRODUCTS = "products";
const PAGE_CART = "cart";

const Shopping = () => {
  const [cartList, setCartList] = useState([]);
  const [page, setPage] = useState(PAGE_PRODUCTS);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const addToCart = (product) => {
    setCartList([...cartList, product]);
  };

  const navigateTo = (nextPage) => {
    setPage(nextPage);
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
      <header id="shopping-head">
        <button onClick={() => navigateTo(PAGE_CART)} id="goToCart">
          Go to Cart ({cartList.length})
        </button>
      </header>
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

  const renderCart = () => (
    <>
      <div id="cart-container">
        <button onClick={() => navigateTo(PAGE_PRODUCTS)} id="products-btn">
          Back to Products
        </button>

        <h1 id="cart-title"> Cart </h1>

        {cartList.map((product) => (
          <div className="card card-container" key={product.id}>
            <div id="product">
              {product.image_url && (
                <img src={product.image_url} alt={product.name || "Product"} />
              )}
              <h2> {product.name} </h2>
              <h3> {product.description} </h3>
              <h3> {formatPrice(product.price)} </h3>
            </div>
          </div>
        ))}
        <button id="checkout-btn">Checkout</button>
      </div>
    </>
  );

  return (
    <div className="main">
      {renderProducts()}
      {page === PAGE_CART && renderCart()}
      <NavBar length={cartList.length} />
    </div>
  );
};

export default Shopping;
