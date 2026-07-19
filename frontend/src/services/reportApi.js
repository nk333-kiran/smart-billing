import axios from "axios";
import { API_URL } from "../config/apiConfig";

const BASE = `${API_URL}/api/reports`;

export const getSummary = async () => {
  const { data } = await axios.get(`${BASE}/summary`);
  return data;
};

export const getSalesReport = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/sales`, { params });
  return data;
};

export const getProfitReport = async () => {
  const { data } = await axios.get(`${BASE}/profit`);
  return data;
};

export const getBestCustomers = async () => {
  const { data } = await axios.get(`${BASE}/best-customers`);
  return data;
};

export const getLowStock = async () => {
  const { data } = await axios.get(`${BASE}/low-stock`);
  return data;
};

export const getTopProducts = async () => {
  const { data } = await axios.get(`${BASE}/top-products`);
  return data;
};
