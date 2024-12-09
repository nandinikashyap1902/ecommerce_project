import axios from "axios";
export const addToCart = async (productId, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      "http://localhost:5000/api/add",
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error.message);
    throw error; // Re-throw the error to handle it in the calling component
  }
};
