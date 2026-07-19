import axios from "axios";
import { API_URL } from "../config/apiConfig";

// Configure a default base URL for all axios requests.
axios.defaults.baseURL = `${API_URL}/api`;
axios.defaults.withCredentials = true; // send cookies if needed

let pending = 0;

// Request interceptor to track loading state.
axios.interceptors.request.use((config) => {
  pending += 1;
  // You could integrate with a global loading UI here.
  return config;
}, (error) => {
  pending = Math.max(pending - 1, 0);
  return Promise.reject(error);
});

// Response interceptor to decrement loading counter and handle errors.
axios.interceptors.response.use((response) => {
  pending = Math.max(pending - 1, 0);
  return response;
}, (error) => {
  pending = Math.max(pending - 1, 0);
  // Centralized error handling – you could show a toast or log.
  console.error("API error:", error);
  return Promise.reject(error);
});

export const isLoading = () => pending > 0;