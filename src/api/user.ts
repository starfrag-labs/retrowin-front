import { api } from ".";
import { IFolder } from "../types/response";
import { cloudUrls } from "./urls";

export const getFavoriteFolders = async () => {
  const getFavoriteFolders = cloudUrls.favorite.list;
  const response = await api.request<IFolder[]>({
    method: getFavoriteFolders.method,
    url: getFavoriteFolders.url,
  });
  return response;
}

export const addFavoriteFolder = async (folderKey: string) => {
  const addFavoriteFolder = cloudUrls.favorite.add(folderKey);
  const response = await api.request({
    method: addFavoriteFolder.method,
    url: addFavoriteFolder.url,
  });
  return response;
}

export const removeFavoriteFolder = async (folderKey: string) => {
  const removeFavoriteFolder = cloudUrls.favorite.remove(folderKey);
  const response = await api.request({
    method: removeFavoriteFolder.method,
    url: removeFavoriteFolder.url,
  });
  return response;
}
