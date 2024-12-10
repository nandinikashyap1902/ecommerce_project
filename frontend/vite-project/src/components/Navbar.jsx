import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/NavBar.css";
import { logout } from "../api/auth"
function NavBar() {
  const { cart,updateCart } = useContext(CartContext);
  const navigate = useNavigate();

 
  const isLoggedIn = localStorage.getItem("token"); 

  const handleLogout = async() => {
    await logout();
    localStorage.removeItem("token"); 
    navigate("/login"); 
    updateCart({ items: [] })
  };

  const uniqueProducts = cart.items.length;

  return (
    <nav className="navbar">
      <h1 className="logo">E-Commerce</h1>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cart">Cart ({uniqueProducts})</Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
