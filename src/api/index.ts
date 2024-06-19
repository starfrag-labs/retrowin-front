import axios from "axios";
import config from "../utils/config";
import { useTokenStore } from "../store/token.store";

export const authApi = axios.create({
  baseURL: config.auth,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const cloudApi = axios.create({
  baseURL: config.cloud,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

authApi.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(config.url);
      
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

cloudApi.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);