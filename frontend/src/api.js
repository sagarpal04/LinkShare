import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

export const getProfile = () => API.get("/user/me");
export const addLink = (data) => API.post("/user/links", data);
export const deleteLink = (id) => API.delete(`/user/links/${id}`);

export const getPublicProfile = (username) => API.get(`/user/${username}`);
