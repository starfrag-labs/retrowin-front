import { generateQueryKey, retryCount } from './index.query';
import { queryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  addFavoriteFolder,
  getFavoriteFolders,
  removeFavoriteFolder,
} from '../../api/user';
import { IFolder } from '../../types/response';
import { checkUser, enrollUser } from '../../api/cloud';
import { getProfile } from '../../api/auth';
import { AxiosError } from 'axios';

export const getProfileQueryOption = queryOptions({
  retry: retryCount,
  queryKey: generateQueryKey('user', 'profile', 'read'),
  queryFn: async () => {
    const data = await getProfile().then((response) => {
      return response.data.data;
    });
    return data;
  },
  throwOnError: true,
});

export const checkUserQueryOption = queryOptions({
  retry: retryCount,
  queryKey: generateQueryKey('user', 'checkUser', 'read'),
  queryFn: async () => {
    const data = await checkUser().then((response) => {
      return response.data;
    }).catch(async (error: AxiosError) => {
      if (error.response?.status === 404) {
        await enrollUser();
        return await checkUser();
      }
      throw error;
    });
    return data;
  },
  throwOnError: true,
});

export const enrollUserMutationOption = {
  retry: retryCount,
  mutationFn: async () => {
    await enrollUser();
  },
};

export const getFavoriteFoldersQueryOption = () =>
  queryOptions<IFolder[]>({
    retry: retryCount,
    queryKey: generateQueryKey('user', 'favorite', 'read'),
    queryFn: async () => {
      const data = await getFavoriteFolders().then((response) => {
        return response.data;
      });
      return data;
    },
  });

export const addFavoriteFolderMutationOption: UseMutationOptions<
  void,
  Error,
  string
> = {
  retry: retryCount,
  mutationFn: async (folderKey: string) => {
    await addFavoriteFolder(folderKey);
  },
};

export const removeFavoriteFolderMutationOption: UseMutationOptions<
  void,
  Error,
  string
> = {
  retry: retryCount,
  mutationFn: async (folderKey: string) => {
    await removeFavoriteFolder(folderKey);
  },
};
