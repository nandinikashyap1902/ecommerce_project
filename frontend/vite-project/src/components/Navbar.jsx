import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/NavBar.css";
import { logout } from "../api/auth";

function NavBar() {
  const { cart, updateCart } = useContext(CartContext);
  const navigate = useNavigate();
 
  const isLoggedIn = localStorage.getItem("token"); 

  const handleLogout = async() => {
    await logout();
    localStorage.removeItem("token"); 
    navigate("/login"); 
    updateCart({ items: [] });
  };

  const uniqueProducts = cart.items.length;

  return (
    <nav className="navbar">
      <h1 className="logo">
        <span className="logo-icon">🛒</span>
        ShopEase
      </h1>
      <ul className="nav-links">
        <li>
          <Link to="/">
            <span role="img" aria-label="home">🏠</span> Home
          </Link>
        </li>
        <li>
          <Link to="/cart" className="cart-link">
            <span role="img" aria-label="cart" className="cart-icon">🛒</span> Cart
            {uniqueProducts > 0 && <span className="cart-count">{uniqueProducts}</span>}
          </Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <span role="img" aria-label="logout">🚪</span> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/signup">
                <span role="img" aria-label="signup">📝</span> Sign Up
              </Link>
            </li>
            <li>
              <Link to="/login">
                <span role="img" aria-label="login">🔑</span> Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
