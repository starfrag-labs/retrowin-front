import { Urls } from "../types/request";
import config from "../utils/config";

export const authUrls: Urls = {
  validate: {
    url: `${config.auth}/token/valid`,
    method: 'GET',
  },
  refresh: {
    url: `${config.auth}/token/refresh`,
    method: 'GET',
  },
  issue: {
    url: `${config.auth}/token/issue`,
    method: 'GET',
  },
  profile: {
    url: `${config.auth}/user/profile`,
    method: 'GET',
  },
};

export const cloudUrls = {
  user: {
    checkUser: {
      url: `${config.cloud}/user`,
      method: 'GET',
    },
    enrollUser: {
      url: `${config.cloud}/user/enroll`,
      method: 'GET',
    },
    deleteUser: {
      url: `${config.cloud}/user`,
      method: 'DELETE',
    },
  },
  folder: {
    createRootFolder: {
      url: `${config.cloud}/folder/root`,
      method: 'POST',
    },
    createFolder: (folderKey: string) => {
      return {
        url: `${config.cloud}/folder/${folderKey}`,
        method: 'POST',
      };
    },
    deleteFolder: (folderKey: string) => {
      return {
        url: `${config.cloud}/folder/${folderKey}`,
        method: 'DELETE',
      };
    },
    readFolder: (folderKey: string) => {
      return {
        url: `${config.cloud}/folder/${folderKey}`,
        method: 'GET',
      };
    },
    getRootFolderKey: {
      url: `${config.cloud}/folder/rootKey`,
      method: 'GET',
    },
    moveFolder: (folderKey: string, targetKey: string) => {
      return {
        url: `${config.cloud}/folder/move/${folderKey}?targetKey=${targetKey}`,
        method: 'PATCH',
      };
    },
    renameFolder: (folderKey: string) => {
      return {
        url: `${config.cloud}/folder/rename/${folderKey}`,
        method: 'PATCH',
      };
    },
  },
  file: {
    uploadFile: (folderKey: string) => {
      return {
        url: `${config.cloud}/file/upload/${folderKey}`,
        method: 'POST',
      };
    },
    downloadFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${config.cloud}/file/download/${folderKey}/${fileKey}`,
        method: 'GET',
      };
    },
    deleteFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${config.cloud}/file/${folderKey}/${fileKey}`,
        method: 'DELETE',
      };
    },
    renameFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${config.cloud}/file/rename/${folderKey}/${fileKey}`,
        method: 'PATCH',
      };
    },
    moveFile: (folderKey: string, fileKey: string, targetKey: string) => {
      return {
        url: `${config.cloud}/file/move/${folderKey}/${fileKey}?targetKey=${targetKey}`,
        method: 'PATCH',
      };
    },
  },
};
