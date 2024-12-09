
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CartPage from "./components/CartPage";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";

import AddProductPage from "./components/AddProductPage";
function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/add-product" element={<AddProductPage />} />
        
      </Routes>
    </div>
  );
}

export default App;
