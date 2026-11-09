import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sst_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginAdmin = (data) => api.post("/api/admin/login", data);
export const registerAdmin = (data) => api.post("/api/admin/register", data);
export const getAdminProfile = () => api.get("/api/admin/me");
export default api;
