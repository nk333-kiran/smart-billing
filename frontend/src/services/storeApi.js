import axios from "axios";
import { API_URL } from "../config/apiConfig";

const BASE = `${API_URL}/api/store`;

export const getStore = async () => {
  const { data } = await axios.get(BASE);
  return data;
};

export const updateStore = async (payload) => {
  const { data } = await axios.put(BASE, payload);
  return data;
};
