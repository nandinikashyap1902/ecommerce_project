import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/Order";
import Payment from "./Payment";
import "../CSS/Payment.css";

function CartPage() {
  const { cart, updateCart } = useContext(CartContext);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  // Calculate total amount
  useEffect(() => {
    // In a real app, you would calculate this based on product prices
    // For now, we'll use a simple calculation
    const amount = cart.items.reduce((total, item) => total + (item.price || 100) * item.quantity, 0);
    setTotalAmount(amount);
    
    // Get user ID from localStorage or context
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setUserId(user.id || "guest");
  }, [cart.items]);

  const handlePlaceOrder = async () => {
    const shippingAddress = prompt("Enter your shipping address:");

    if (!shippingAddress) {
      alert("Please provide a shipping address.");
      return;
    }

    try {
      const data = await placeOrder(shippingAddress);
      // Set the order ID from the response
      setOrderId(data.orderId || `order-${Date.now()}`);
      // Show payment component
      setShowPayment(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  const handlePaymentSuccess = (payment) => {
    // Clear cart after successful payment
    updateCart({ items: [] });
    // Navigate to success page
    navigate('/payment-success', { 
      state: { 
        orderId: payment.orderId, 
        paymentId: payment.razorpayPaymentId 
      } 
    });
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    alert("Payment failed. Please try again.");
    // You might want to handle the failed order here
    setShowPayment(false);
  };

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="cart-items">
            {cart.items.map((item) => (
              <li key={item.productId} className="cart-item">
                <span>Product ID: {item.productId}</span>
                <span>Quantity: {item.quantity}</span>
                <span>Price: ₹{(item.price || 100) * item.quantity}</span>
              </li>
            ))}
          </ul>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
            
            {!showPayment ? (
              <button 
                className="place-order-btn" 
                onClick={handlePlaceOrder}
                disabled={cart.items.length === 0}
              >
                Place Order
              </button>
            ) : (
              <div className="payment-section">
                <h3>Complete Payment</h3>
                <Payment 
                  amount={totalAmount} 
                  orderId={orderId} 
                  userId={userId}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
                <button 
                  className="cancel-payment-btn" 
                  onClick={() => setShowPayment(false)}
                >
                  Cancel Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
