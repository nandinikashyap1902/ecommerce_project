import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRazorpayKey, createOrder, verifyPayment } from '../api/payment';
import '../CSS/Payment.css';

const Payment = ({ amount, orderId, userId, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Get Razorpay key
      const keyData = await getRazorpayKey();
      const key = keyData.key;

      // 3. Create order
      const orderData = {
        amount,
        currency: 'INR',
        receipt: `receipt_order_${orderId}`,
        notes: {
          orderId: orderId,
          userId: userId
        },
        userId,
        orderId
      };

      const { order } = await createOrder(orderData);

      // 4. Open Razorpay checkout
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Your Ecommerce Store',
        description: `Payment for order #${orderId}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 5. Verify payment
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
              amount,
              userId
            };

            const verificationResponse = await verifyPayment(paymentData);
            
            if (verificationResponse.success) {
              if (onSuccess) {
                onSuccess(verificationResponse.payment);
              } else {
                navigate('/payment-success', { 
                  state: { 
                    orderId, 
                    paymentId: response.razorpay_payment_id 
                  } 
                });
              }
            } else {
              setError('Payment verification failed');
              if (onFailure) {
                onFailure('Payment verification failed');
              }
            }
          } catch (error) {
            setError(error.message || 'Payment verification failed');
            if (onFailure) {
              onFailure(error.message || 'Payment verification failed');
            }
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Your Ecommerce Store'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      setError(error.message || 'Something went wrong');
      if (onFailure) {
        onFailure(error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      {error && <div className="payment-error">{error}</div>}
      <button 
        className="payment-button" 
        onClick={handlePayment} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default Payment;
