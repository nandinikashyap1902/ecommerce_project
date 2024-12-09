import  { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import '../CSS/ProductList.css'
function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/products");
          console.log(response)
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
          {products.length > 0 ? (
      products.map((product) => <ProductCard key={product._id} product={product} />)
    ) : (
          <p>Loading products...</p>
        
      )}
    </div>
  );
}

export default ProductList;
