import { addToCart } from "../api/cart";
import { CartContext } from "../context/CartContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { updateCart } = useContext(CartContext); 
  
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

  // Default placeholder image if product doesn't have an image
  const productImage = product.image || getRandomImage(product._id);
  
  // State for loading animation
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        alert("Please log in to add products to the cart.");
        navigate("/login"); 
        return;
      }
      
      setIsLoading(true);
      const response = await addToCart(product._id, 1);
      updateCart(response.data.cart);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'add-success';
      successMessage.textContent = '✓ Added to cart';
      document.body.appendChild(successMessage);
      
      // Remove message after animation
      setTimeout(() => {
        successMessage.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(successMessage), 500);
      }, 1500);
      
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <img 
        src={productImage} 
        alt={product.name} 
        className="product-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
        }}
      />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="stock">In Stock: {product.stock}</p>
      <button 
        onClick={handleAddToCart} 
        disabled={isLoading}
        className={isLoading ? "loading-btn" : ""}
      >
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
