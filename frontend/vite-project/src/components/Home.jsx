import "../CSS/Home.css";
import ProductList from "./ProductList";

function Home() {
  return (
    <div className="home">
      <div className="content">

      <h2>Welcome to E-Commerce</h2>
          <p>Find the best deals and exclusive products here!</p>
      </div>
          <ProductList/>
    </div>
  );
}

export default Home;
