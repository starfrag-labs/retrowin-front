import { api } from '../config';
import axios from 'axios';
import { queryOptions } from '@tanstack/react-query'

export const readRootQueryOptions= () => {
  queryOptions({
    queryKey: ['rootFolder'],
    queryFn: async () => {
      const readRoot = cloudUrls.folder.readFolder('');
      await axios.request({
        method: readRoot.method,
        url: readRoot.url,
      })
    }
  })
}

export const readFolderQueryOptions = (folderKey: string) => {
  queryOptions({
    queryKey: ['readFolder', folderKey],
    queryFn: async () => {
      const readFolder = cloudUrls.folder.readFolder(folderKey);
      await axios.request({
        method: readFolder.method,
        url: readFolder.url,
      })
    }
  })
};

const cloudUrls = {
  user: {
    checkUser: {
      url: `${api.cloud}/user`,
      method: 'GET',
    },
    createUser: {
      url: `${api.cloud}/user/enroll`,
      method: 'POST',
    },
    deleteUser: {
      url: `${api.cloud}/user`,
      method: 'DELETE',
    },
  },
  folder: {
    readFolder: (folderKey: string) => {
      return {
        url: `${api.cloud}/folder/${folderKey}`,
        method: 'GET',
      };
    },
    moveFolder: (folderKey: string) => {
      return {
        url: `${api.cloud}/folder/move/${folderKey}`,
        method: 'PATCH',
      };
    },
    createRootFolder: {
      url: `${api.cloud}/folder/create`,
      method: 'POST',
    },
    createFolder: (folderKey: string) => {
      return {
        url: `${api.cloud}/folder/create/${folderKey}`,
        method: 'POST',
      };
    },
  },
  file: {
    uploadFile: (folderKey: string) => {
      return {
        url: `${api.cloud}/file/upload/${folderKey}`,
        method: 'POST',
      };
    },
    downloadFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${api.cloud}/file/download/${folderKey}/${fileKey}`,
        method: 'GET',
      };
    },
    streamFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${api.cloud}/file/stream/${folderKey}/${fileKey}`,
        method: 'GET',
      };
    },
    deleteFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${api.cloud}/file/${folderKey}/${fileKey}`,
        method: 'DELETE',
      };
    },
    renameFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${api.cloud}/file/rename/${folderKey}/${fileKey}`,
        method: 'PATCH',
      };
    },
    moveFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${api.cloud}/file/move/${folderKey}/${fileKey}`,
        method: 'PATCH',
      };
    },
  },
};
