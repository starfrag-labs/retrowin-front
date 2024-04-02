import axios from 'axios';
import { api } from '../config';

const authUrls = {
  login: `${api.auth}/auth/local/login`,
  logout: `${api.auth}/user/logout`,
  validate: `${api.auth}/token/validate`,
};

export const validate = (accessToken: string) => {
  return axios.get(authUrls.validate, {
    headers: {
      Authorization: accessToken,
    },
    withCredentials: true,
  });
};

export const login = (email: string, password: string) => {
  return axios.post(
    authUrls.login,
    {
      email: email,
      password: password,
    },
    {
      withCredentials: true,
    }
  );
};

export const logout = async (accessToken: string) => {
  return axios.get(authUrls.logout, {
    headers: {
      Authorization: accessToken,
    },
    withCredentials: true,
  });
};