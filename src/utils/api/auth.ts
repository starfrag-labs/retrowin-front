import axios from 'axios';
import { api } from '../config';

const authUrls = {
  login: {
    url: `${api.auth}/auth/local/login`,
    method: 'POST',
  },
  logout: {
    url: `${api.auth}/auth/local/logout`,
    method: 'GET',
  },
  validate: {
    url: `${api.auth}/token/valid`,
    method: 'GET',
  },
  refresh: {
    url: `${api.auth}/token/refresh`,
    method: 'GET',
  },
};

export const isValid = (accessToken: string) => {
  return axios.request({
    method: authUrls.validate.method,
    url: authUrls.validate.url,
    headers: {
      Authorization: accessToken,
    },
    withCredentials: true,
  });
}

export const refresh = (accessToken: string) => {
  return axios.request({
    method: authUrls.refresh.method,
    url: authUrls.refresh.url,
    headers: {
      Authorization: accessToken,
    },
    withCredentials: true,
  });
}

export const validate = (accessToken: string) => {
  return axios.request({
    method: authUrls.validate.method,
    url: authUrls.validate.url,
    headers: {
      Authorization: accessToken,
    },
    withCredentials: true,
  })
};

export const login = (email: string, password: string) => {
  return axios.request({
    method: authUrls.login.method,
    url: authUrls.login.url,
    data: {
      email,
      password,
    },
    withCredentials: true,
  });
};

export const logout = async (accessToken: string) => {
  return axios.request({
    method: authUrls.logout.method,
    url: authUrls.logout.url,
    headers: {
      Authorization: accessToken,
    },
    withCredentials: true,
  });
};