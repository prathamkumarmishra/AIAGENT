import axios from "axios";

const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Adventures
export const getAdventures = (params) => api.get("/adventures", { params });
export const generatePlan = (data) => api.post("/adventures/generate-plan", data);
export const saveTrip = (data) => api.post("/adventures/save-trip", data);
export const getMyTrips = () => api.get("/adventures/my-trips");
export const reviewTrip = (id, data) => api.put(`/adventures/trips/${id}/review`, data);
export const chatWithAI = (data) => api.post("/adventures/chat", data);

// Weather
export const getWeather = (location) => api.get("/weather", { params: { location } });

// Auth
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const googleLogin = (idToken) => api.post("/auth/google", { idToken });
export const getMe = () => api.get("/auth/me");

export default api;
