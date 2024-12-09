import { useState } from "react";
import { addProduct } from "../api/admin";
import { useNavigate } from "react-router-dom";
function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addProduct(form);
      alert("Product added successfully!");
      navigate("/");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error adding product:", error.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Product Name:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
        <label>Price:</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required />
        <label>Stock:</label>
        <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
        <label>Description:</label>
        <textarea name="description" value={form.description} onChange={handleChange}></textarea>
        <label>Image URL:</label>
        <input type="text" name="image" value={form.image} onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProductPage;
