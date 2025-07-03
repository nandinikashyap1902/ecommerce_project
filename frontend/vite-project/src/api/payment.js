import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payment';

// Get Razorpay Key
export const getRazorpayKey = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-razorpay-key`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    throw error;
  }
};

// Create Order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/create-order`, orderData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Verify Payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/verify-payment`, paymentData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Get Payment by Order ID
export const getPaymentByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/payment/${orderId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};
