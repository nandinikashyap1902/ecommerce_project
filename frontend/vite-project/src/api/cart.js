import axios from "axios";
export const addToCart = async (productId, quantity) => {
  try {
   

    const response = await axios.post(
      "http://localhost:5000/api/add",
      { productId, quantity },
      { withCredentials: true, headers: {
        "Content-Type": "application/json",
      },}
    );

    return response;
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error.message);
    throw error; 
  }
};
