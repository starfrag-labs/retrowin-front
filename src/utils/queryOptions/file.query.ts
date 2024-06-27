import { queryOptions } from '@tanstack/react-query';
import { downloadFile } from '../../api/cloud';

export const readFileQueryOption = (
  accessToken: string,
  folderKey: string,
  fileKey: string
) =>
  queryOptions<Blob>({
    enabled: !!accessToken,
    retry: 3,
    queryKey: ['read', 'file', fileKey],
    queryFn: async () => {
      const data = await downloadFile(accessToken, folderKey, fileKey).then(
        (response) => {
          return response.data;
        }
      );
      return data;
    },
  });
