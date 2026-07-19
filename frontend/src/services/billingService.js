import axios from "axios";
import { API_URL } from "../config/apiConfig";

export const getProducts = async () => {
  const { data } = await axios.get(`${API_URL}/api/products`);
  return data;
};

export const searchProducts = async (query) => {
  const { data } = await axios.get(`${API_URL}/api/products`, {
    params: { search: query },
  });
  return data;
};

export const getCustomers = async () => {
  const { data } = await axios.get(`${API_URL}/api/customers`, {
    params: { limit: 1000 },
  });
  return data.customers || [];
};

export const generateBill = async (billData) => {
  const { data } = await axios.post(`${API_URL}/api/bills`, billData);
  return data;
};

export const getBills = async () => {
  const { data } = await axios.get(`${API_URL}/api/bills`);
  return data;
};

export const getBill = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/bills/${id}`);
  return data;
};

export const deleteBill = async (id) => {
  const { data } = await axios.delete(`${API_URL}/api/bills/${id}`);
  return data;
};

export const createRazorpayOrder = async (billId) => {
  const { data } = await axios.post(`${API_URL}/api/payment/create-order`, { billId });
  return data;
};

export const verifyRazorpayPayment = async (paymentData) => {
  const { data } = await axios.post(`${API_URL}/api/payment/verify`, paymentData);
  return data;
};
