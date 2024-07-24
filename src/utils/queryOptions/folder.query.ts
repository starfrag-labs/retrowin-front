import { queryOptions } from '@tanstack/react-query';
import { getFolderInfo, getFolderPath, getRootFolderKey, readFolder } from '../../api/cloud';
import { getFolderInfoData, ReadFolderData } from '../../types/response';
import { retryCount } from './index.query';

export const getRootFolderKeyQueryOption = () =>
  queryOptions<string>({
    retry: retryCount,
    queryKey: ['folder', 'root', 'read'],
    queryFn: async () => {
      const data = await getRootFolderKey().then((response) => {
        return response.data;
      });
      return data;
    },
  });

export const readFolderQueryOption = (folderKey: string) =>
  queryOptions<ReadFolderData>({
    placeholderData: {
      folders: [],
      files: [],
    },
    retry: retryCount,
    queryKey: ['folder', folderKey, 'read'],
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
    queryKey: ['folder', folderKey, 'info'],
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
    queryKey: ['folder', folderKey, 'path'],
    queryFn: async () => {
      const data = await getFolderPath(folderKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!folderKey,
  });