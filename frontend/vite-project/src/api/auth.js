import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/auth" });

export const signUp = (formData) => API.post("/signup", formData);
export const signIn = (formData) => API.post("/signin", formData);
