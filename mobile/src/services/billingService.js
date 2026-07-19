import api from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
};

export const getProducts = async (search = "") => {
  const { data } = await api.get("/api/products", { params: { search } });
  return data;
};

export const getCustomers = async () => {
  const { data } = await api.get("/api/customers", {
    params: { limit: 1000 },
  });
  return data.customers || [];
};

export const createBill = async (payload) => {
  const { data } = await api.post("/api/bills", payload);
  return data;
};

export const getBills = async () => {
  const { data } = await api.get("/api/bills");
  return data;
};
