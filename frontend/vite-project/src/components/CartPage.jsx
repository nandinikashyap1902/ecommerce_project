import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/Order";
function CartPage() {
  const { cart, updateCart } = useContext(CartContext);
  console.log(cart)
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    // This could be a modal or a prompt to collect the shipping address
    const shippingAddress = prompt("Enter your shipping address:");

    if (!shippingAddress) {
      alert("Please provide a shipping address.");
      return;
    }

    try {
      const data = await placeOrder(shippingAddress);
      alert("Order placed successfully!");
      updateCart({ items: [] }); // Clear cart in frontend after placing the order
      navigate("/orders"); // Redirect to orders page to show the placed order
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    
    <div>
      <h2>Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
              {cart.items.map((item) => (
                
                <li key={item.productId}>
                
               productId: {item.productId}   <span>quantity :</span>  {item.quantity}
              </li>
           
            ))}
            
          </ul>
          
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
