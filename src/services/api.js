import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("menvibe_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products
export const getProducts = (params) => API.get("/products", { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (formData) =>
  API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// Orders
// payload is FormData when paymentMethod is "BankTransfer" (includes screenshot file).
// For COD, a plain object works fine — axios will JSON-encode it.
export const placeOrder = (payload, isFormData = false) =>
  API.post("/orders", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

export const getMyOrders = () => API.get("/orders/myorders");
export const getOrder = (id) => API.get(`/orders/${id}`);

// Admin orders
export const getAllOrders = (params) => API.get("/admin/orders", { params });
export const getAdminOrder = (id) => API.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id, data) => API.put(`/admin/orders/${id}/status`, data);
export const verifyPayment = (id, data) => API.put(`/admin/orders/${id}/verify-payment`, data);

// Admin account settings
export const updateAccount = (data) => API.put("/admin/account", data);

// Public order tracking
export const trackOrder = (orderNumber) => API.get(`/track/${orderNumber}`);

// Hero slides (public)
export const getHeroSlides = () => API.get("/hero-slides");

// Hero slides (admin)
export const getAllHeroSlides = () => API.get("/hero-slides/admin/all");
export const createHeroSlide = (formData) =>
  API.post("/hero-slides", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateHeroSlide = (id, formData) =>
  API.put(`/hero-slides/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteHeroSlide = (id) => API.delete(`/hero-slides/${id}`);

export default API;