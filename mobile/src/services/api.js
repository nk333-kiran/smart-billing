import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const apiUrl =
  Constants.expoConfig?.extra?.apiUrl || "http://10.0.2.2:5000";

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
