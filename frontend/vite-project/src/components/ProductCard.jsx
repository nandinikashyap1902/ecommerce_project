
import { addToCart } from "../api/cart";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
function ProductCard({ product }) {
  const navigate = useNavigate();
  const { updateCart } = useContext(CartContext); 
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        alert("Please log in to add products to the cart.");
        navigate("/login"); 
        return;
      }
      const response = await addToCart(product._id, 1);
      alert("Product added to cart!");
     
      updateCart(response.data.cart);
      
    } catch (error) {
      console.error("Error adding to cart:", error.response.data.message);
    }
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
     
      <button onClick={handleAddToCart}>Add to Cart</button>
      
     
    </div>
  );
}

export default ProductCard;
