import { queryOptions } from '@tanstack/react-query';
import { downloadFile, getFileInfo } from '../../api/cloud';
import { retryCount } from './index.query';

export const readFileQueryOption = (
  fileKey: string
) =>
  queryOptions<Blob>({
    retry: retryCount,
    queryKey: ['read', 'file', fileKey],
    queryFn: async () => {
      const data = await downloadFile(fileKey).then(
        (response) => {
          return response.data;
        }
      );
      return data;
    },
    enabled: !!fileKey,
  });

export const getFileInfoQueryOption = (fileKey: string) =>
  queryOptions({
    retry: retryCount,
    queryKey: ['file', 'info', fileKey],
    queryFn: async () => {
      const data = await getFileInfo(fileKey).then((response) => {
        return response.data;
      });
      return data;
    },
    enabled: !!fileKey,
  });