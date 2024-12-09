
import { addToCart } from "../api/cart";

function ProductCard({ product }) {
  const handleAddToCart = async () => {
    try {
     
      const response = await addToCart(product._id, product.stock);
      alert("Product added to cart!");
      console.log("Cart Response:", response.data);
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
