import { generateQueryKey, retryCount } from "./index.query";
import { queryOptions } from "@tanstack/react-query";
import { getFavoriteFolders } from "../../api/user";
import { IFolder } from "../../types/response";

export const getFavoriteFoldersQueryOption = () =>
  queryOptions<IFolder[]>({
    retry: retryCount,
    queryKey: generateQueryKey('favorite', 'list', 'read'),
    queryFn: async () => {
      const data = await getFavoriteFolders().then((response) => {
        return response.data;
      });
      return data;
    },
  });