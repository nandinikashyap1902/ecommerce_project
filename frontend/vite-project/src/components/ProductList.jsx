import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import '../CSS/ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/products");
        
        // Ensure all products have an image property, even if it's null
        // This will allow the ProductCard component to use its fallback mechanism
        const productsWithImageProperty = response.data.map(product => ({
          ...product,
          image: product.image || null
        }));
        
        setProducts(productsWithImageProperty);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      {loading ? (
        <div className="loading-products">
          <p>Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        products.map((product) => <ProductCard key={product._id} product={product} />)
      ) : (
        <div className="no-products">
          <p>No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
