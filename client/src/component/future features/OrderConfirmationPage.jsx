
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const navigate = useNavigate();

    const handlePlaceOrder = () => {
        alert('Order placed successfully!');
        navigate('/');
    };

    return (
        <div>
            <h2>Order Confirmation</h2>
            <p>Your order has been confirmed. Thank you for your purchase!</p>

        </div>
    );
};

export default OrderConfirmationPage;
