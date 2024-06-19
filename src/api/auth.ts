import { IProfile } from '../types/response';
import { authUrls } from './urls';
import { api } from '.';

export const isValid = () => {
  return api.request({
    method: authUrls.validate.method,
    url: authUrls.validate.url,
  });
};

export const refresh = () => {
  return api.request({
    method: authUrls.refresh.method,
    url: authUrls.refresh.url,
  });
};

export const issue = async (code: string) => {
  const response = await api.request({
    method: authUrls.issue.method,
    url: `${authUrls.issue.url}?code=${code}`,
  });
  return response;
};

export const getProfile = () => {
  return api.request<{
    message: string;
    data: IProfile;
  }>({
    method: authUrls.profile.method,
    url: authUrls.profile.url,
  });
};
