import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getPaymentByOrderId } from '../api/payment';
import '../CSS/Payment.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (!location.state || !location.state.orderId) {
          navigate('/');
          return;
        }

        const { orderId } = location.state;
        const response = await getPaymentByOrderId(orderId);
        
        if (response.success) {
          setPaymentDetails(response.payment);
        } else {
          setError('Failed to fetch payment details');
        }
      } catch (error) {
        setError('An error occurred while fetching payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="payment-success-container">
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-container">
        <div className="payment-error">{error}</div>
        <Link to="/" className="continue-shopping-btn">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-icon">✓</div>
      <h1 className="payment-success-title">Payment Successful!</h1>
      <p className="payment-success-message">
        Thank you for your purchase. Your order has been confirmed.
      </p>

      {paymentDetails && (
        <div className="payment-details">
          <div className="payment-detail-item">
            <span className="payment-detail-label">Order ID:</span>
            <span>{paymentDetails.orderId}</span>
          </div>
          <div className="payment-detail-item">
            <span className="payment-detail-label">Payment ID:</span>
            <span>{paymentDetails.razorpayPaymentId}</span>
          </div>
          <div className="payment-detail-item">
            <span className="payment-detail-label">Amount:</span>
            <span>₹{paymentDetails.amount}</span>
          </div>
          <div className="payment-detail-item">
            <span className="payment-detail-label">Date:</span>
            <span>{new Date(paymentDetails.createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}

      <Link to="/" className="continue-shopping-btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default PaymentSuccess;
