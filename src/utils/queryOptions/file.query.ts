import { queryOptions } from '@tanstack/react-query';
import { downloadFile, getFileInfo } from '../../api/cloud';
import { generateQueryKey, retryCount } from './index.query';

export const downloadFileQueryOption = (fileKey: string) =>
  queryOptions<Blob>({
    retry: retryCount,
    queryKey: generateQueryKey('file', fileKey, 'read'),
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
    queryKey: generateQueryKey('file', fileKey, 'info'),
    queryFn: async () => {
      const data = await getFileInfo(fileKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!fileKey,
  });
