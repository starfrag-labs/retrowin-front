import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { MenuGenerator } from './MenuGenerator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useWindowStore } from '../../store/window.store';
import { useElementStore } from '../../store/element.store';
import { generateQueryKey } from '../../utils/queryOptions/index.query';
import {
  addFavoriteFolderMutationOption,
  getFavoriteFoldersQueryOption,
  removeFavoriteFolderMutationOption,
} from '../../utils/queryOptions/user.query';
import { useCallback, useEffect, useState } from 'react';
import {
  deleteFileMutationOption,
  downloadFileQueryOption,
} from '../../utils/queryOptions/file.query';
import { deleteFolderMutationOption } from '../../utils/queryOptions/folder.query';

export const ElementOptionMenu = ({
  elementKey,
  menuRef,
}: {
  elementKey: string;
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const queryClient = useQueryClient();
  const favoriteFoldersQuery = useQuery(getFavoriteFoldersQueryOption());

  const currentMenu = menuRef.current;

  // Mutations
  const deleteFile = useMutation(deleteFileMutationOption);
  const deleteFolder = useMutation(deleteFolderMutationOption);
  const addFavoriteFolder = useMutation(addFavoriteFolderMutationOption);
  const removeFavoriteFolder = useMutation(removeFavoriteFolderMutationOption);

  // states
  // const [menuList, setMenuList] = useState<
  //   { name: string; action: () => void }[]
  // >([]);
  const [isPinned, setIsPinned] = useState(false);

  // store states
  const elementInfo = useElementStore((state) =>
    state.getElementInfo(elementKey)
  );
  const selectedKeys = useElementStore((state) => state.selectedKeys);

  // store functions
  const getElementInfo = useElementStore((state) => state.getElementInfo);
  const setRenamingKey = useElementStore((state) => state.setRenamingKey);
  const newWindow = useWindowStore((state) => state.newWindow);

  useEffect(() => {
    if (favoriteFoldersQuery.isSuccess && favoriteFoldersQuery.data) {
      setIsPinned(
        favoriteFoldersQuery.data.some((folder) => folder.key === elementKey)
      );
    }
  }, [elementKey, favoriteFoldersQuery.data, favoriteFoldersQuery.isSuccess]);

  const handleDownload = useCallback(() => {
    if (!currentMenu) return;
    queryClient
      .ensureQueryData(
        downloadFileQueryOption(elementKey, elementInfo?.name ?? 'unknown')
      )
      .then((response) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', elementInfo?.name ?? 'unknown');
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    currentMenu.style.display = 'none';
  }, [currentMenu, elementInfo?.name, elementKey, queryClient]);

  const handleOpen = useCallback(() => {
    if (!currentMenu) return;
    const contentType = getContentType(elementInfo?.type ?? '');
    if (contentType?.startsWith('image')) {
      newWindow(elementKey, 'image');
    } else if (contentType?.startsWith('video')) {
      newWindow(elementKey, 'video');
    } else if (elementInfo?.type === 'folder') {
      newWindow(elementKey, 'navigator');
    }
    currentMenu.style.display = 'none';
  }, [currentMenu, elementInfo, elementKey, newWindow]);

  const handleDelete = useCallback(() => {
    if (!currentMenu) return;
    selectedKeys.forEach((key) => {
      const elementInfo = getElementInfo(key);
      if (!elementInfo) return;
      if (elementInfo?.type === 'file') {
        deleteFile.mutateAsync(key).finally(() => {
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('folder', elementInfo.parentKey),
          });
        });
      } else {
        deleteFolder.mutateAsync(key).finally(() => {
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('folder', elementInfo.parentKey),
          });
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('user', 'favorite'),
          });
        });
      }
    });
    currentMenu.style.display = 'none';
  }, [
    currentMenu,
    deleteFile,
    deleteFolder,
    getElementInfo,
    queryClient,
    selectedKeys,
  ]);

  const handleRename = useCallback(() => {
    if (!currentMenu) return;
    setRenamingKey(elementKey);
    currentMenu.style.display = 'none';
  }, [currentMenu, elementKey, setRenamingKey]);

  const addFavorite = useCallback(async () => {
    if (!currentMenu) return;
    addFavoriteFolder.mutateAsync(elementKey).finally(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('user', 'favorite'),
      });
    });
    currentMenu.style.display = 'none';
  }, [addFavoriteFolder, currentMenu, elementKey, queryClient]);

  const removeFavorite = useCallback(async () => {
    if (!currentMenu) return;
    removeFavoriteFolder.mutateAsync(elementKey).finally(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('user', 'favorite'),
      });
    });
    currentMenu.style.display = 'none';
  }, [currentMenu, elementKey, queryClient, removeFavoriteFolder]);

  const fileMenuList = useCallback(
    () => [
      {
        name: 'Open',
        action: handleOpen,
      },
      {
        name: 'Download',
        action: handleDownload,
      },
      {
        name: '/',
        action: () => {},
      },
      {
        name: 'Delete',
        action: handleDelete,
      },
      {
        name: 'Rename',
        action: handleRename,
      },
    ],
    [handleDelete, handleDownload, handleOpen, handleRename]
  );

  const folderMenuList = useCallback(
    () => [
      {
        name: 'Open',
        action: handleOpen,
      },
      {
        name: '/',
        action: () => {},
      },
      {
        name: 'Delete',
        action: handleDelete,
      },
      {
        name: 'Rename',
        action: handleRename,
      },
      {
        name: '/',
        action: () => {},
      },
      {
        name: isPinned ? 'Unpin' : 'Pin to Favorite',
        action: isPinned ? removeFavorite : addFavorite,
      },
    ],
    [
      handleOpen,
      handleDelete,
      handleRename,
      isPinned,
      removeFavorite,
      addFavorite,
    ]
  );

  const multipleMenuList = useCallback(
    () => [
      {
        name: 'Delete',
        action: handleDelete,
      },
    ],
    [handleDelete]
  );

  // useEffect(() => {
  //   if (selectedKeys.length > 1) {
  //     setMenuList(multipleMenuList);
  //   } else if (elementInfo?.type === 'file') {
  //     setMenuList(fileMenuList);
  //   } else if (elementInfo?.type === 'folder') {
  //     setMenuList(folderMenuList);
  //   }
  // }, [
  //   elementInfo,
  //   fileMenuList,
  //   folderMenuList,
  //   multipleMenuList,
  //   selectedKeys,
  // ]);

  if (selectedKeys.length > 1) {
    return <MenuGenerator menuList={multipleMenuList()} />;
  } else if (elementInfo?.type === 'file') {
    return <MenuGenerator menuList={fileMenuList()} />;
  } else if (elementInfo?.type === 'folder') {
    return <MenuGenerator menuList={folderMenuList()} />;
  }

  return <></>;
};
