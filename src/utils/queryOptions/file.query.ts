import { queryOptions } from '@tanstack/react-query';
import { downloadFile } from '../../api/cloud';

export const readFileQueryOption = (
  folderKey: string,
  fileKey: string
) =>
  queryOptions<Blob>({
    retry: 3,
    queryKey: ['read', 'file', fileKey],
    queryFn: async () => {
      const data = await downloadFile(folderKey, fileKey).then(
        (response) => {
          return response.data;
        }
      );
      return data;
    },
  });
