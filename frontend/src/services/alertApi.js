import axios from "axios";
import { API_URL } from "../config/apiConfig";

const BASE = `${API_URL}/api/alerts`;

export const getAlertCounts = async () => {
  const { data } = await axios.get(`${BASE}/counts`);
  return data;
};

export const getLowStock = async () => {
  const { data } = await axios.get(`${BASE}/low-stock`);
  return data;
};

export const getExpiring = async (days = 30) => {
  const { data } = await axios.get(`${BASE}/expiring`, { params: { days } });
  return data;
};

export const getExpired = async () => {
  const { data } = await axios.get(`${BASE}/expired`);
  return data;
};
