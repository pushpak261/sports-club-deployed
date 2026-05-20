import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import '../../style/productList.css';

const ProductList = ({ products }) => {
    const { cart, dispatch } = useCart();

    const incrementItem = useCallback((product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    }, [dispatch]);

    const decrementItem = useCallback((product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    }, [cart, dispatch]);

    return (
        <div className="product-list">
            {products.map((product) => {
                const cartItem = cart.find(item => item.id === product.id);
                return (
                    <div className="product-item" key={product.id}>
                        <Link to={`/product/${product.id}`}>
                            {/* PERFORMANCE: lazy loading for below-the-fold images */}
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-image"
                                loading="lazy"
                            />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <span>${product.price.toFixed(2)}</span>
                        </Link>
                        {cartItem ? (
                            <div className="quantity-controls">
                                <button onClick={() => decrementItem(product)}> - </button>
                                <span>{cartItem.quantity}</span>
                                <button onClick={() => incrementItem(product)}> + </button>
                            </div>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
};

// === PERFORMANCE: Memoize to prevent re-renders when parent state changes ===
export default React.memo(ProductList);
