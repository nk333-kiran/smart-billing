import axios from "axios";

const BASE = "/api/customers";

export const getCustomers = async (params = {}) => {
  const { data } = await axios.get(BASE, { params });
  return data;
};

export const getCustomer = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const addCustomer = async (payload) => {
  const { data } = await axios.post(BASE, payload);
  return data;
};

export const updateCustomer = async (id, payload) => {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await axios.delete(`${BASE}/${id}`);
  return data;
};

export const getCustomerHistory = async (id) => {
  const { data } = await axios.get(`${BASE}/history/${id}`);
  return data;
};
