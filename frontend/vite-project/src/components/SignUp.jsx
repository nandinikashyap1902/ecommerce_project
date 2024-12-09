
import '../CSS/Form.css'
import { useState } from "react";
import { signUp } from "../api/auth";
function SignUp() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await signUp(form);
        console.log("SignUp Success:", response.data);
      } catch (error) {
        console.error("SignUp Error:", error.response.data.message);
      }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <label>Username:</label>
      <input type="text" name="username" value={form.username} onChange={handleChange} required />
      <label>Email:</label>
      <input type="email" name="email" value={form.email} onChange={handleChange} required />
      <label>Password:</label>
      <input type="password" name="password" value={form.password} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
