import { api } from '.';
import { IProfile } from '../types/response';
import { memberUrls } from './urls';

export const getProfile = () => {
  return api.request<{
    message: string;
    data: IProfile;
  }>({
    method: memberUrls.profile.method,
    url: memberUrls.profile.url,
  });
};
