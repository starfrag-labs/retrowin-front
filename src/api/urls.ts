import { authPrefix, cloudPrefix } from '../utils/config';

export const memberUrls = {
  profile: {
    url: `${authPrefix}/manager/member/profile`,
    method: 'GET',
  },
};

export const cloudUrls = {
  user: {
    checkUser: {
      url: `${cloudPrefix}/user`,
      method: 'GET',
    },
    enrollUser: {
      url: `${cloudPrefix}/user/enroll`,
      method: 'GET',
    },
    deleteUser: {
      url: `${cloudPrefix}/user`,
      method: 'DELETE',
    },
  },
  folder: {
    createRootFolder: {
      url: `${cloudPrefix}/folder/root`,
      method: 'POST',
    },
    createFolder: (folderKey: string) => {
      return {
        url: `${cloudPrefix}/folder/${folderKey}`,
        method: 'POST',
      };
    },
    deleteFolder: (folderKey: string) => {
      return {
        url: `${cloudPrefix}/folder/${folderKey}`,
        method: 'DELETE',
      };
    },
    readFolder: (folderKey: string) => {
      return {
        url: `${cloudPrefix}/folder/${folderKey}`,
        method: 'GET',
      };
    },
    getRootFolderKey: {
      url: `${cloudPrefix}/folder/rootKey`,
      method: 'GET',
    },
    moveFolder: (folderKey: string, targetKey: string) => {
      return {
        url: `${cloudPrefix}/folder/move/${folderKey}?targetKey=${targetKey}`,
        method: 'PATCH',
      };
    },
    renameFolder: (folderKey: string) => {
      return {
        url: `${cloudPrefix}/folder/rename/${folderKey}`,
        method: 'PATCH',
      };
    },
    info: (folderKey: string) => {
      return {
        url: `${cloudPrefix}/folder/${folderKey}/info`,
        method: 'GET',
      };
    },
    path: (folderKey: string) => {
      return {
        url: `${cloudPrefix}/folder/${folderKey}/path`,
        method: 'GET',
      };
    }
  },
  file: {
    uploadFile: (folderKey: string) => {
      return {
        url: `${cloudPrefix}/file/upload/${folderKey}`,
        method: 'POST',
      };
    },
    downloadFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${cloudPrefix}/file/download/${fileKey}`,
        method: 'GET',
      };
    },
    deleteFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${cloudPrefix}/file/${fileKey}`,
        method: 'DELETE',
      };
    },
    renameFile: (folderKey: string, fileKey: string) => {
      return {
        url: `${cloudPrefix}/file/rename/${fileKey}`,
        method: 'PATCH',
      };
    },
    moveFile: (folderKey: string, fileKey: string, targetKey: string) => {
      return {
        url: `${cloudPrefix}/file/move/${fileKey}?targetKey=${targetKey}`,
        method: 'PATCH',
      };
    },
    getFileInfo: (fileKey: string) => {
      return {
        url: `${cloudPrefix}/file/info/${fileKey}`,
        method: 'GET',
      };
    }
  },
};
