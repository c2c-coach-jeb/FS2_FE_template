import React from "react";
import './product.css';
import currency from "currency.js";

const Product = ({product}) => {
  return (
    <div className="product">
      <img src={product.image_url} alt="" />
      <h2> {product.name} </h2>
       {currency(product.price).format()}
    </div>
  );
};

export default Product;
