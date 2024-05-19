import { queryOptions } from '@tanstack/react-query';
import { readRootFolder, createRootFolder, readFolder } from './api/cloud';

export const readFolderQuery = (accessToken: string, folderKey: string) =>
  queryOptions({
    queryKey: ['read', 'folder', folderKey],
    queryFn: async () => {
      if (folderKey === 'home') {
        let data = await readRootFolder(accessToken)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.log(error);
            
            return null;
          });
        if (!data) {
          const createResult = await createRootFolder(accessToken).catch(() => {
            return false;
          });
          if (createResult) {
            data = await readRootFolder(accessToken).then((response) => {
              return response.data;
            });
          }
        }
        return data;
      } else {
        const data = await readFolder(accessToken, folderKey)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.log(error);
            
            return null;
          });
        return data;
      }
    },
  });
