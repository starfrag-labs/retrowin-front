import { queryOptions } from '@tanstack/react-query';
import { getFolderInfo, getFolderPath, getRootFolderKey, readFolder } from '../../api/cloud';
import { getFolderInfoData, ReadFolderData } from '../../types/response';
import { retryCount } from './index.query';

export const getRootFolderKeyQueryOption = () =>
  queryOptions<string>({
    retry: retryCount,
    queryKey: ['read', 'folder'],
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
    queryKey: ['read', 'folder', folderKey],
    queryFn: async () => {
      const data = await readFolder(folderKey).then((response) => {
        return response.data;
      });
      return data;
    },
  });

export const getFolderInfoQueryOption = (folderKey: string) =>
  queryOptions<getFolderInfoData>({
    retry: retryCount,
    queryKey: ['info', 'folder', folderKey],
    queryFn: async () => {
      const data = await getFolderInfo(folderKey).then((response) => {
        return response.data;
      });
      return data;
    },
  });

export const getFolderPathQueryOption = (folderKey: string) =>
  queryOptions<string[]>({
    retry: retryCount,
    queryKey: ['path', 'folder', folderKey],
    queryFn: async () => {
      const data = await getFolderPath(folderKey).then((response) => {
        return response.data;
      });
      return data;
    },
  });