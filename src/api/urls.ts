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
    createFolder: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/${folderKey}`,
      method: 'POST',
    }),
    deleteFolder: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/${folderKey}`,
      method: 'DELETE',
    }),
    readFolder: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/${folderKey}`,
      method: 'GET',
    }),
    getRootFolderKey: {
      url: `${cloudPrefix}/folder/rootKey`,
      method: 'GET',
    },
    moveFolder: (folderKey: string, targetKey: string) => ({
      url: `${cloudPrefix}/folder/move/${folderKey}?targetKey=${targetKey}`,
      method: 'PATCH',
    }),
    renameFolder: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/rename/${folderKey}`,
      method: 'PATCH',
    }),
    info: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/${folderKey}/info`,
      method: 'GET',
    }),
    path: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/${folderKey}/path`,
      method: 'GET',
    })
  },
  file: {
    uploadFile: (folderKey: string) => ({
      url: `${cloudPrefix}/file/upload/${folderKey}`,
      method: 'POST',
    }),
    downloadFile: (fileKey: string) => ({
      url: `${cloudPrefix}/file/download/${fileKey}`,
      method: 'GET',
    }),
    deleteFile: (fileKey: string) => ({
      url: `${cloudPrefix}/file/${fileKey}`,
      method: 'DELETE',
    }),
    renameFile: (fileKey: string) => ({
      url: `${cloudPrefix}/file/rename/${fileKey}`,
      method: 'PATCH',
    }),
    moveFile: (fileKey: string, targetKey: string) => ({
      url: `${cloudPrefix}/file/move/${fileKey}?targetKey=${targetKey}`,
      method: 'PATCH',
    }),
    getFileInfo: (fileKey: string) => ({
      url: `${cloudPrefix}/file/info/${fileKey}`,
      method: 'GET',
    })
  },
};
