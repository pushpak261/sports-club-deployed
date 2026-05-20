import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ totalAmount }) => {
    return (
        <PayPalScriptProvider options={{ "client-id": "AQnZkbeWlWUtMrejlLoVqUf8d1bIlK28dOsb2vKrtjQ0lEvX8C5g1OowLPbKonCUmF0W_0zp7SvFw5VN" }}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: totalAmount.toFixed(2), // Use the total amount from props
                            },
                        }],
                    });
                }}
                onApprove={async (data, actions) => {
                    const order = await actions.order.capture();
                    alert('Transaction completed by ' + order.payer.name.given_name);
                }}
                onError={(err) => {
                    console.error('PayPal Checkout onError', err);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;




