import axios from "axios";
import { API_URL } from "../config/apiConfig";

const BASE = `${API_URL}/api/bills`;

export const createBill = async (payload) => {
  const { data } = await axios.post(BASE, payload);
  return data;
};

export const getBills = async () => {
  const { data } = await axios.get(BASE);
  return data;
};

export const getBill = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};
