import axios, { AxiosError } from 'axios';
import config from '../utils/config';

export const api = axios.create({
  baseURL: config.gate,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = `${config.auth}?redirect=${config.redirectUrl}`;
    }
    return Promise.reject(error);
  }
);