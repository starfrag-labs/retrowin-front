import { queryOptions } from '@tanstack/react-query';
import { readFolder } from './api/cloud';
import { ReadFolderData } from '../types/response';

export const readFolderQueryOption = (accessToken: string, folderKey: string) =>
  queryOptions<ReadFolderData>({
    enabled: !!accessToken,
    placeholderData: {
      folders: [],
      files: [],
    },
    retry: 3,
    queryKey: ['read', 'folder', folderKey],
    queryFn: async () => {
      const data = await readFolder(accessToken, folderKey).then((response) => {
        return response.data;
      });
      return data;
    },
  });