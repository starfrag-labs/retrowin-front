import { deleteFile, deleteFolder, downloadFile } from '../../api/cloud';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { MenuGenerator } from './MenuGenerator';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWindowStore } from '../../store/window.store';
import { useElementStore } from '../../store/element.store';
import { generateQueryKey } from '../../utils/queryOptions/index.query';
import { addFavoriteFolder, removeFavoriteFolder } from '../../api/user';
import { getFavoriteFoldersQueryOption } from '../../utils/queryOptions/user.query';
import { useCallback, useEffect, useState } from 'react';

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

  // states
  const [menuList, setMenuList] = useState<{ name: string; action: () => void }[]>([]);
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
      setIsPinned(favoriteFoldersQuery.data.some((folder) => folder.key === elementKey));
    }
  }, [elementKey, favoriteFoldersQuery.data, favoriteFoldersQuery.isSuccess]);

  const handleDownload = useCallback(() => {
    if (!currentMenu) return;
    downloadFile(elementKey, elementInfo?.name ?? 'unknown').then(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', elementInfo?.name ?? 'unknown');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    );
    currentMenu.style.display = 'none';
  }, [currentMenu, elementInfo?.name, elementKey]);

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
        deleteFile(key).then(() => {
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('file', elementInfo.parentKey),
          });
        });
      } else {
        deleteFolder(key).then(() => {
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('folder', elementInfo.parentKey),
          });
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('favorite'),
          });
        });
      }
    });
    currentMenu.style.display = 'none';
  }, [currentMenu, getElementInfo, queryClient, selectedKeys]);

  const handleRename = useCallback(() => {
    if (!currentMenu) return;
    setRenamingKey(elementKey);
    currentMenu.style.display = 'none';
  }, [currentMenu, elementKey, setRenamingKey]);

  const addFavorite = useCallback(async () => {
    if (!currentMenu) return;
    await addFavoriteFolder(elementKey).then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('favorite'),
      });
    });
    currentMenu.style.display = 'none';
  }, [currentMenu, elementKey, queryClient]);

  const removeFavorite = useCallback(async () => {
    if (!currentMenu) return;
    await removeFavoriteFolder(elementKey).then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('favorite'),
      });
    });
    currentMenu.style.display = 'none';
  }, [currentMenu, elementKey, queryClient]);

  const fileMenuList = useCallback(() => [
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
  ], [handleDelete, handleDownload, handleOpen, handleRename]);

  const folderMenuList = useCallback(() => [
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
    }
  ], [handleOpen, handleDelete, handleRename, isPinned, removeFavorite, addFavorite]);

  const multipleMenuList = useCallback(() => [
    {
      name: 'Delete',
      action: handleDelete,
    },
  ], [handleDelete]);

  useEffect(() => {
    if (selectedKeys.length > 1) {
      setMenuList(multipleMenuList);
    } else if (elementInfo?.type === 'file') {
      setMenuList(fileMenuList);
    } else if (elementInfo?.type === 'folder') {
      setMenuList(folderMenuList);
    }
  }, [elementInfo, fileMenuList, folderMenuList, multipleMenuList, selectedKeys]);

  return <MenuGenerator menuList={menuList} />;
};
