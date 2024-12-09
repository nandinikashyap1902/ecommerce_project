import  { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import '../CSS/NavBar.css'
function NavBar() {
  const { cart } = useContext(CartContext);

  const uniqueProducts = cart.items.length;

  return (
    <nav className="navbar">
      <h1 className="logo">E-Commerce</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cart">Cart ({uniqueProducts})</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
