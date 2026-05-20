import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import PayPalButton from '../../component/future features/PayPalButton';
import '../../style/cartPage.css';

const CartPage = () => {
    const { cart, dispatch } = useCart();
    const [message, setMessage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const navigate = useNavigate();

    const incrementItem = (product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    };

    const decrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    };

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        const confirmPlaceOrder = window.confirm("Do you want to place the order?");
        if (!confirmPlaceOrder) {
            return;
        }

        const orderItems = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const orderRequest = {
            totalPrice,
            items: orderItems,
            paymentMethod,
        };

        try {
            const response = await ApiService.createOrder(orderRequest);
            setMessage(response.message);
            if (response.status === 200) {
                dispatch({ type: 'CLEAR_CART' });
                navigate("/order-confirmation");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Failed to place an order');
        }
    };

    return (
        <div className="cart-page">
            <h1>Cart</h1>
            {message && <p className="response-message">{message}</p>}

            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    <ul>
                        {cart.map(item => (
                            <li key={item.id} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="cart-item-details">
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <span>${item.price.toFixed(2)}</span>
                                </div>
                                <div className="quantity-controls">
                                    <button onClick={() => decrementItem(item)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => incrementItem(item)}>+</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h2>Total: ${totalPrice.toFixed(2)}</h2>

                    <div className="payment-options">
                        <label>
                            <input
                                type="radio"
                                value="paypal"
                                checked={paymentMethod === 'paypal'}
                                onChange={() => setPaymentMethod('paypal')}
                            />
                            PayPal
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                            />
                            Cash on Delivery
                        </label>

                        {paymentMethod === 'paypal' && <PayPalButton totalAmount={totalPrice} />}

                        {paymentMethod === 'cod' && (
                            <button className="checkout-button" onClick={handleCheckout}>
                                Place Order
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
