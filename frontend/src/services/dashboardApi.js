import axios from "axios";
import { API_URL } from "../config/apiConfig";

const DASHBOARD_BASE = `${API_URL}/api/dashboard`;

export const getDashboardSummary = async () => {
  const { data } = await axios.get(DASHBOARD_BASE);
  return data;
};

export const getRecentBills = async () => {
  const { data } = await axios.get(`${DASHBOARD_BASE}/recent-bills`);
  return data;
};

export const getSalesAnalytics = async () => {
  const { data } = await axios.get(`${DASHBOARD_BASE}/sales`);
  return data;
};

export const getRevenueAnalytics = async () => {
  const { data } = await axios.get(`${DASHBOARD_BASE}/revenue`);
  return data;
};

export const getTopProducts = async () => {
  const { data } = await axios.get(`${DASHBOARD_BASE}/top-products`);
  return data;
};
