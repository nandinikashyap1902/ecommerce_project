import  { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../api/order";
import { useNavigate } from "react-router-dom";

function PlaceOrderPage() {
  const { cart, updateCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    const shippingAddress = prompt("Enter your shipping address:");
    if (!shippingAddress) return;

    try {
      const data = await placeOrder(shippingAddress);
      alert("Order placed successfully!");
      updateCart({ items: [] }); // Clear cart in frontend
      navigate("/orders"); // Redirect to orders page
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div>
      <h2>Cart Summary</h2>
      <ul>
        {cart.items.map((item) => (
          <li key={item.productId}>
            {item.productId}: {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>
      <h3>Total: ${cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}</h3>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}

export default PlaceOrderPage;
