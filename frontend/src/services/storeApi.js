import axios from "axios";

const BASE = "/api/store";

export const getStore = async () => {
  const { data } = await axios.get(BASE);
  return data;
};

export const updateStore = async (payload) => {
  const { data } = await axios.put(BASE, payload);
  return data;
};
