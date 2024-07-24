import { queryOptions } from '@tanstack/react-query';
import { downloadFile, getFileInfo, getFilePath } from '../../api/cloud';
import { retryCount } from './index.query';

export const downloadFileQueryOption = (fileKey: string) =>
  queryOptions<Blob>({
    retry: retryCount,
    queryKey: ['file', fileKey, 'read'],
    queryFn: async () => {
      const data = await downloadFile(fileKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!fileKey,
  });

export const getFileInfoQueryOption = (fileKey: string) =>
  queryOptions({
    retry: retryCount,
    queryKey: ['file', fileKey, 'info'],
    queryFn: async () => {
      const data = await getFileInfo(fileKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!fileKey,
  });

export const getFilePathQueryOption = (fileKey: string) =>
  queryOptions({
    retry: retryCount,
    queryKey: ['file', fileKey, 'path'],
    queryFn: async () => {
      const data = await getFilePath(fileKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!fileKey,
  });
