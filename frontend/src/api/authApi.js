import axios from "axios";
import { API_URL } from "../config/apiConfig";

const API_BASE = `${API_URL}/api/auth`;

export const registerUser = async (payload) => {
  const response = await axios.post(`${API_BASE}/register`, payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await axios.post(`${API_BASE}/login`, payload);
  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
