export const memberUrls = {
  profile: {
    url: `/ifauth/manager/member/profile`,
    method: 'GET',
  },
};

export const cloudUrls = {
  user: {
    checkUser: {
      url: `/ifcloud/user`,
      method: 'GET',
    },
    enrollUser: {
      url: `/ifcloud/user/enroll`,
      method: 'GET',
    },
    deleteUser: {
      url: `/ifcloud/user`,
      method: 'DELETE',
    },
  },
  folder: {
    createRootFolder: {
      url: `/ifcloud/folder/root`,
      method: 'POST',
    },
    createFolder: (folderKey: string) => {
      return {
        url: `/ifcloud/folder/${folderKey}`,
        method: 'POST',
      };
    },
    deleteFolder: (folderKey: string) => {
      return {
        url: `/ifcloud/folder/${folderKey}`,
        method: 'DELETE',
      };
    },
    readFolder: (folderKey: string) => {
      return {
        url: `/ifcloud/folder/${folderKey}`,
        method: 'GET',
      };
    },
    getRootFolderKey: {
      url: `/ifcloud/folder/rootKey`,
      method: 'GET',
    },
    moveFolder: (folderKey: string, targetKey: string) => {
      return {
        url: `/ifcloud/folder/move/${folderKey}?targetKey=${targetKey}`,
        method: 'PATCH',
      };
    },
    renameFolder: (folderKey: string) => {
      return {
        url: `/ifcloud/folder/rename/${folderKey}`,
        method: 'PATCH',
      };
    },
  },
  file: {
    uploadFile: (folderKey: string) => {
      return {
        url: `/ifcloud/file/upload/${folderKey}`,
        method: 'POST',
      };
    },
    downloadFile: (folderKey: string, fileKey: string) => {
      return {
        url: `/ifcloud/file/download/${folderKey}/${fileKey}`,
        method: 'GET',
      };
    },
    deleteFile: (folderKey: string, fileKey: string) => {
      return {
        url: `/ifcloud/file/${folderKey}/${fileKey}`,
        method: 'DELETE',
      };
    },
    renameFile: (folderKey: string, fileKey: string) => {
      return {
        url: `/ifcloud/file/rename/${folderKey}/${fileKey}`,
        method: 'PATCH',
      };
    },
    moveFile: (folderKey: string, fileKey: string, targetKey: string) => {
      return {
        url: `/ifcloud/file/move/${folderKey}/${fileKey}?targetKey=${targetKey}`,
        method: 'PATCH',
      };
    },
  },
};
