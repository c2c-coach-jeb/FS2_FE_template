import React, {useEffect, useState} from "react";
import productImg from '../images/productImg.png';
import axios from "axios";

const Featured = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getFeaturedProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
                console.log("response", response);
                const products = response.data.rows;
                setProducts(products.slice(0, 5));
            } catch (e) {
                console.error("Error retrieving featured products", e);
                setProducts([]);
            }
        }
        getFeaturedProducts().then(() => {
        });
    }, [])
    return (
        <>
            <div id="gallery-head">
                <h1> Gallery </h1>
            </div>
            <div id="card-container">
                {
                    products.map((product) => {
                        return (
                            <div className="featured-card">
                                <div hidden={true}>{product.id}</div>
                                <img
                                    className="img"
                                    src={product.image_url}
                                    alt=""
                                />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>{product.price}</p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
};

export default Featured;
