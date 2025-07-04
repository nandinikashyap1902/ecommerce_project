import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/Order";
import Payment from "./Payment";
import "../CSS/Payment.css";
import "../CSS/CartPage.css";

function CartPage() {
  const { cart, updateCart } = useContext(CartContext);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  // Array of random product images for different categories
  const randomProductImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", // Watch
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", // Camera
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", // Headphones
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", // Smart watch
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", // Laptop
    "https://images.unsplash.com/photo-1598532213005-067bc52e13d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", // Shoes
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", // Clothing
    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"  // Bag
  ];
  
  // Generate a consistent random image for each product based on its ID
  const getRandomImage = (productId) => {
    // Use the product ID to create a consistent index
    const charSum = productId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const index = charSum % randomProductImages.length;
    return randomProductImages[index];
  };

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

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cart.items.map(item => 
      item.productId === productId ? {...item, quantity: newQuantity} : item
    );
    
    updateCart({ items: updatedItems });
  };

  const handleRemoveItem = (productId) => {
    const updatedItems = cart.items.filter(item => item.productId !== productId);
    updateCart({ items: updatedItems });
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is empty.</p>
          <button 
            className="place-order-btn" 
            onClick={() => navigate('/')}
            style={{ marginTop: '20px', maxWidth: '300px' }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          <ul className="cart-items">
            {cart.items.map((item) => (
              <li key={item.productId} className="cart-item">
                <img 
                  src={item.image || getRandomImage(item.productId)} 
                  alt={`Product ${item.productId}`}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="cart-item-details">
                  <div className="cart-item-name">Product ID: {item.productId}</div>
                  <div className="cart-item-price">₹{(item.price || 100) * item.quantity}</div>
                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
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
                Proceed to Checkout
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
