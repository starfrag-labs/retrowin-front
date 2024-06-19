import axios from 'axios';
import { IProfile } from '../types/response';
import { authUrls } from './urls';
import { authApi } from '.';

export const isValid = (accessToken: string) => {
  return authApi.request({
    method: authUrls.validate.method,
    url: '/token/valid',
    // headers: {
    //   Authorization: `Bearer ${accessToken}`,
    // },
  });
  // return axios.request({
  //   method: authUrls.validate.method,
  //   url: authUrls.validate.url,
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });
};

export const refresh = (accessToken: string) => {
  return axios.request({
    method: authUrls.refresh.method,
    url: authUrls.refresh.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

export const getProfile = (accessToken: string) => {
  return axios.request<{
    message: string;
    data: IProfile;
  }>({
    method: authUrls.profile.method,
    url: authUrls.profile.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
