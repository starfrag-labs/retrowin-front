import config, { authPrefix, cloudPrefix } from '../utils/config';

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
  favorite: {
    add: (folderKey: string) => ({
      url: `${cloudPrefix}/user/favorite/${folderKey}`,
      method: 'POST',
    }),
    remove: (folderKey: string) => ({
      url: `${cloudPrefix}/user/favorite/${folderKey}`,
      method: 'DELETE',
    }),
    list: {
      url: `${cloudPrefix}/user/favorite`,
      method: 'GET',
    },
  },
  folder: {
    createRoot: {
      url: `${cloudPrefix}/folder/root`,
      method: 'POST',
    },
    create: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/${folderKey}`,
      method: 'POST',
    }),
    delete: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/${folderKey}`,
      method: 'DELETE',
    }),
    read: (folderKey: string) => ({
      url: `${cloudPrefix}/folder/${folderKey}`,
      method: 'GET',
    }),
    getRootFolderKey: {
      url: `${cloudPrefix}/folder/rootKey`,
      method: 'GET',
    },
    move: (folderKey: string, targetKey: string) => ({
      url: `${cloudPrefix}/folder/move/${folderKey}?targetKey=${targetKey}`,
      method: 'PATCH',
    }),
    rename: (folderKey: string) => ({
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
    }),
  },
  file: {
    upload: (folderKey: string) => ({
      url: `${cloudPrefix}/file/upload/${folderKey}`,
      method: 'POST',
    }),
    download: (fileKey: string) => ({
      url: `${cloudPrefix}/file/download/${fileKey}`,
      method: 'GET',
    }),
    delete: (fileKey: string) => ({
      url: `${cloudPrefix}/file/${fileKey}`,
      method: 'DELETE',
    }),
    rename: (fileKey: string) => ({
      url: `${cloudPrefix}/file/rename/${fileKey}`,
      method: 'PATCH',
    }),
    move: (fileKey: string, targetKey: string) => ({
      url: `${cloudPrefix}/file/move/${fileKey}?targetKey=${targetKey}`,
      method: 'PATCH',
    }),
    info: (fileKey: string) => ({
      url: `${cloudPrefix}/file/info/${fileKey}`,
      method: 'GET',
    }),
  },
};

export const srcUrl = (fileKey: string) => `${config.gate}${cloudUrls.file.download(fileKey).url}`;