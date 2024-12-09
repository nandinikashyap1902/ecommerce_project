import axios from "axios";

export const placeOrder = async (shippingAddress) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/place-order",
      { shippingAddress },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error.response?.data || error.message);
    throw error;
  }
};
