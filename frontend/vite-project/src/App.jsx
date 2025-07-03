
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CartPage from "./components/CartPage";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";

import AddProductPage from "./components/AddProductPage";
import PlaceOrderPage from "./components/PlaceOrder";
import PaymentSuccess from "./components/PaymentSuccess";
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
        <Route path="/orders" element={<PlaceOrderPage/>}></Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
