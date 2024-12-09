import  { useState } from "react";
import "../CSS/Form.css";
import { signIn } from "../api/auth";
import { useNavigate } from "react-router-dom";
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Login Data:", form);
      // Handle form submission
      try {
        const response = await signIn(form);
          console.log("Login Success:", response.data);
          const { token, role } = response.data;

      // Save token in localStorage
      localStorage.setItem("token", token);

      // Redirect based on role
      if (role === "admin") {
        navigate("/add-product");
      } else {
        navigate("/");
      }
      } catch (error) {
        console.error("Login Error:", error.response.data.message);
      }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" name="email" value={form.email} onChange={handleChange} required />
      <label>Password:</label>
      <input type="password" name="password" value={form.password} onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
