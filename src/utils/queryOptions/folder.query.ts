import { queryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  createFolder,
  createRootFolder,
  deleteFolder,
  getFolderInfo,
  getFolderPath,
  getRootFolderKey,
  moveFolder,
  readFolder,
  renameFolder,
} from '../../api/cloud';
import { getFolderInfoData, ReadFolderData } from '../../types/response';
import { generateQueryKey, retryCount, strongRetryCount } from './index.query';
import { AxiosError } from 'axios';

export const getRootFolderKeyQueryOption = (createRoot: boolean | undefined = false) =>
  queryOptions<string>({
    retry: retryCount,
    queryKey: generateQueryKey('folder', 'root', 'read'),
    queryFn: async () => {
      const data = await getRootFolderKey()
        .then((response) => {
          return response.data;
        })
        .catch(async (error: AxiosError) => {
          if (error.response?.status === 404 && createRoot) {
            const result = await createRootFolder();
            return result.data;
          }
          throw error;
        });
      return data;
    },
    throwOnError: true,
  });

export const readFolderQueryOption = (folderKey: string) =>
  queryOptions<ReadFolderData>({
    placeholderData: {
      folders: [],
      files: [],
    },
    retry: retryCount,
    queryKey: generateQueryKey('folder', folderKey, 'read'),
    queryFn: async () => {
      const data = await readFolder(folderKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!folderKey,
  });

export const getFolderInfoQueryOption = (folderKey: string) =>
  queryOptions<getFolderInfoData>({
    retry: retryCount,
    queryKey: generateQueryKey('folder', folderKey, 'info'),
    queryFn: async () => {
      const data = await getFolderInfo(folderKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!folderKey,
  });

export const getFolderPathQueryOption = (folderKey: string) =>
  queryOptions<string[]>({
    retry: retryCount,
    queryKey: generateQueryKey('folder', folderKey, 'path'),
    queryFn: async () => {
      const data = await getFolderPath(folderKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!folderKey,
  });

export const createFolderMutationOption: UseMutationOptions<
  void,
  Error,
  { folderName: string; parentKey: string }
> = {
  retry: strongRetryCount,
  mutationFn: async ({ folderName, parentKey }) => {
    await createFolder(parentKey, folderName);
  },
};


export const moveFolderMutationOption: UseMutationOptions<
  void,
  Error,
  { folderKey: string; targetKey: string }
> = {
  retry: retryCount,
  mutationFn: async ({
    folderKey,
    targetKey,
  }: {
    folderKey: string;
    targetKey: string;
  }) => {
    await moveFolder(folderKey, targetKey);
  },
};

export const renameFolderMutationOption: UseMutationOptions<
  void,
  Error,
  { folderKey: string; folderName: string }
> = {
  retry: retryCount,
  mutationFn: async ({
    folderKey,
    folderName,
  }: {
    folderKey: string;
    folderName: string;
  }) => {
    await renameFolder(folderKey, folderName);
  },
};

export const deleteFolderMutationOption: UseMutationOptions<
  void,
  Error,
  string
> = {
  retry: retryCount,
  mutationFn: async (folderKey: string) => {
    await deleteFolder(folderKey);
  },
};
