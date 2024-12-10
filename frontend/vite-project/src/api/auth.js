import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/auth" });

export const signUp = (formData) => API.post("/signup", formData);
export const signIn = (formData) => API.post("/signin", formData,{ withCredentials: true });
export const logout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
      throw error;
    }
  };