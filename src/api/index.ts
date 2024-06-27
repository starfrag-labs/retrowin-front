import axios, { AxiosError, AxiosResponse } from 'axios';
import config from '../utils/config';
import { useTokenStore } from '../store/token.store';
import { authUrls } from './urls';

export const api = axios.create({
  baseURL: config.api,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    useTokenStore.getState().resetRequestCount();
    return response;
  },
  async (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
      const token = useTokenStore.getState().accessToken;
      const requestCount = useTokenStore.getState().requestCount;
      if (error.response?.status === 401 && requestCount < 1 && error.config) {
        // create url
        await axios
          .request({
            method: authUrls.refresh.method,
            url: `${config.api}${authUrls.refresh.url}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          .then((response) => {
            const newToken = response.headers['authorization'].split(' ')[1];
            useTokenStore.getState().setAccessToken(newToken);
            useTokenStore.getState().incrementRequestCount();
            if (error.config) return api.request(error.config);
          })
          .catch(() => {});
        window.location.reload();
      }
    }
    useTokenStore.getState().setAccessToken('');
    useTokenStore.getState().resetRequestCount();
    return Promise.reject(error);
  }
);
