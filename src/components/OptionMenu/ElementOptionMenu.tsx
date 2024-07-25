import { deleteFile, deleteFolder, downloadFile } from '../../api/cloud';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { MenuGenerator } from './MenuGenerator';
import { useQueryClient } from '@tanstack/react-query';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { useWindowStore } from '../../store/window.store';
import { useElementStore } from '../../store/element.store';

export const ElementOptionMenu = ({
  elementKey,
  menuRef,
}: {
  elementKey: string;
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const queryClient = useQueryClient();
  const currentMenu = menuRef.current;
  const elementInfo = useElementStore((state) =>
    state.getElementInfo(elementKey)
  );
  const selectedKeys = useElementStore((state) => state.selectedKeys);

  const getElementInfo = useElementStore((state) => state.getElementInfo);
  const setRenamingKey = useElementStore((state) => state.setRenamingKey);
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleDownload = () => {
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
  };

  const handleOpen = () => {
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
  };

  const handleDelete = () => {
    if (!currentMenu) return;
    selectedKeys.forEach((key) => {
      const elementInfo = getElementInfo(key);
      if (!elementInfo) return;
      if (elementInfo?.type === 'file') {
        deleteFile(key).then(() => {
          queryClient.invalidateQueries(
            readFolderQueryOption(elementInfo.parentKey)
          );
        });
      } else {
        deleteFolder(key).then(() => {
          queryClient.invalidateQueries(
            readFolderQueryOption(elementInfo.parentKey)
          );
        });
      }
    });
    currentMenu.style.display = 'none';
  };

  const handleRename = () => {
    if (!currentMenu) return;
    setRenamingKey(elementKey);
    currentMenu.style.display = 'none';
  };

  const fileMenuList = [
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
  ];

  const folderMenuList = [
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
  ];

  const multipleMenuList = [
    {
      name: 'Delete',
      action: handleDelete,
    },
  ];

  let currentMenuList: {
    name: string;
    action: () => void;
  }[] = [];

  if (selectedKeys.length > 1) {
    currentMenuList = multipleMenuList;
  } else if (elementInfo?.type === 'file') {
    currentMenuList = fileMenuList;
  } else if (elementInfo?.type === 'folder') {
    currentMenuList = folderMenuList;
  }

  if (!elementInfo) return <></>;

  return <MenuGenerator menuList={currentMenuList} />;
};
