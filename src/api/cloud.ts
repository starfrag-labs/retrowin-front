import { ReadFolderData } from '../types/response';
import axios from 'axios';
import { cloudUrls } from './urls';

export const checkUser = async (accessToken: string) => {
  const checkUser = cloudUrls.user.checkUser;
  const response = await axios.request({
    method: checkUser.method,
    url: checkUser.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const enrollUser = async (accessToken: string) => {
  const createUser = cloudUrls.user.enrollUser;
  const response = await axios.request({
    method: createUser.method,
    url: createUser.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const deleteUser = async (accessToken: string) => {
  const deleteUser = cloudUrls.user.deleteUser;
  const response = await axios.request({
    method: deleteUser.method,
    url: deleteUser.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const createRootFolder = async (accessToken: string) => {
  const createRootFolder = cloudUrls.folder.createRootFolder;
  const response = await axios.request<string>({
    method: createRootFolder.method,
    url: createRootFolder.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const createFolder = async (
  accessToken: string,
  folderKey: string,
  folderName: string
) => {
  const createFolder = cloudUrls.folder.createFolder(folderKey);
  const response = await axios.request<string>({
    method: createFolder.method,
    url: createFolder.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      folderName: folderName,
    },
  });
  return response;
};

export const readFolder = async (accessToken: string, folderKey: string) => {
  const readFolder = cloudUrls.folder.readFolder(folderKey);
  const response = await axios.request<ReadFolderData>({
    method: readFolder.method,
    url: readFolder.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const getRootFolderKey = async (accessToken: string) => {
  const getRootFolderKey = cloudUrls.folder.getRootFolderKey;
  const response = await axios.request<string>({
    method: getRootFolderKey.method,
    url: getRootFolderKey.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const deleteFolder = async (accessToken: string, folderKey: string) => {
  const deleteFolder = cloudUrls.folder.deleteFolder(folderKey);
  const response = await axios.request({
    method: deleteFolder.method,
    url: deleteFolder.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const moveFolder = async (
  accessToken: string,
  folderKey: string,
  targetKey: string
) => {
  const moveFolder = cloudUrls.folder.moveFolder(folderKey, targetKey);
  const response = await axios.request({
    method: moveFolder.method,
    url: moveFolder.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const renameFolder = async (
  accessToken: string,
  folderKey: string,
  folderName: string
) => {
  const renameFolder = cloudUrls.folder.renameFolder(folderKey);
  const response = await axios.request({
    method: renameFolder.method,
    url: renameFolder.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      folderName: folderName,
    },
  });
  return response;
};

export const uploadChunk = async (
  accessToken: string,
  folderKey: string,
  chunk: File | Blob,
  fileName: string,
  totalChunks: number,
  chunkNumber: number
) => {
  const uploadFile = cloudUrls.file.uploadFile(folderKey);
  const formData = new FormData();
  formData.append('file', chunk, fileName);
  formData.append('fileName', fileName);
  formData.append('totalChunks', totalChunks.toString());
  formData.append('chunkNumber', chunkNumber.toString());

  const response = await axios.request({
    method: uploadFile.method,
    url: uploadFile.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
  return response;
};

export const downloadFile = async (
  accessToken: string,
  folderKey: string,
  fileKey: string
) => {
  const downloadFile = cloudUrls.file.downloadFile(folderKey, fileKey);
  const response = await axios.request<Blob>({
    method: downloadFile.method,
    url: downloadFile.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: 'blob',
  });
  return response;
};

export const deleteFile = async (
  accessToken: string,
  folderKey: string,
  fileKey: string
) => {
  const deleteFile = cloudUrls.file.deleteFile(folderKey, fileKey);
  const response = await axios.request({
    method: deleteFile.method,
    url: deleteFile.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const renameFile = async (
  accessToken: string,
  folderKey: string,
  fileKey: string,
  fileName: string
) => {
  const renameFile = cloudUrls.file.renameFile(folderKey, fileKey);
  const response = await axios.request({
    method: renameFile.method,
    url: renameFile.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      fileName: fileName,
    },
  });
  return response;
};

export const moveFile = async (
  accessToken: string,
  folderKey: string,
  fileKey: string,
  newFolderKey: string
) => {
  const moveFile = cloudUrls.file.moveFile(folderKey, fileKey);
  const response = await axios.request({
    method: moveFile.method,
    url: moveFile.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      newFolderKey: newFolderKey,
    },
  });
  return response;
};

