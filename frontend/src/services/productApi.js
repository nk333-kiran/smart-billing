import axios from "axios";

const BASE = "/api/products";

export const getProducts = async (params = {}) => {
  const { data } = await axios.get(BASE, { params });
  return data;
};

export const getProduct = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const addProduct = async (payload) => {
  const { data } = await axios.post(BASE, payload);
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`${BASE}/${id}`);
  return data;
};

export const getLowStockProducts = async () => {
  const { data } = await axios.get(`${BASE}/low-stock`);
  return data;
};
