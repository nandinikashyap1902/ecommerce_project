import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function CartPage() {
  const { cart } = useContext(CartContext);

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.items.map((item) => (
            <li key={item.productId}>
              Product ID: {item.productId}, Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartPage;
