import axios from 'axios';
import { api } from '../config';

interface Methods {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

interface AuthUrls {
  [key: string]: Methods;
}

const authUrls: AuthUrls = {
  validate: {
    url: `${api.auth}/token/valid`,
    method: 'GET',
  },
  refresh: {
    url: `${api.auth}/token/refresh`,
    method: 'GET',
  },
  issue: {
    url: `${api.auth}/token/issue`,
    method: 'GET',
  },
};

export const isValid = (accessToken: string) => {
  return axios.request({
    method: authUrls.validate.method,
    url: authUrls.validate.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
};

export const refresh = (accessToken: string) => {
  return axios.request({
    method: authUrls.refresh.method,
    url: authUrls.refresh.url,
    headers: {
      Authorization: accessToken,
    },
    withCredentials: true,
  });
};

export const issue = async (code: string) => {
   const response = await axios.request({
    method: authUrls.issue.method,
    url: `${authUrls.issue.url}?code=${code}`,
    withCredentials: true,
  });
  return response;
};