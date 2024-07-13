import { useElementStore } from '../../store/element.store';
import { deleteFile, deleteFolder, downloadFile } from '../../api/cloud';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { MenuGenerator } from './MenuGenerator';
import { useQueryClient } from '@tanstack/react-query';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { useWindowStore } from '../../store/window.store';

export const ElementOptionMenu = ({
  elementKey,
  menuRef,
}: {
  elementKey: string;
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const queryClient = useQueryClient();
  const currentMenu = menuRef.current;
  const selectedElements = useElementStore((state) =>
    state.elements.filter((element) => element.selected)
  );
  const element = useElementStore((state) => state.findElement(elementKey));
  const startRenaming = useElementStore((state) => state.startRenaming);
  const deleteElement = useElementStore((state) => state.deleteElement);
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleDownload = () => {
    if (!element || !currentMenu) return;
    downloadFile(element.parentKey, element.key, element.name).then(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', element.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    );
    currentMenu.style.display = 'none';
  };

  const handleOpen = () => {
    if (!element || !currentMenu) return;
    const contentType = getContentType(element.name);
    if (
      element.type === 'file' &&
      (contentType === 'image/jpg' ||
        contentType === 'image/jpeg' ||
        contentType === 'image/png' ||
        contentType === 'image/gif')
    ) {
      newWindow(element.key, 'image');
    } else if (element.type === 'file' && contentType === 'video/mp4') {
      newWindow(element.key, 'video');
    } else if (element.type === 'folder') {
      newWindow(element.key, 'navigator');
    }
    currentMenu.style.display = 'none';
  };

  const handleDelete = () => {
    if (!element || !currentMenu) return;
    if (selectedElements.length > 1) {
      selectedElements.forEach((element) => {
        if (element.type === 'file') {
          deleteFile(element.parentKey, element.key).then(() => {
            queryClient.invalidateQueries(
              readFolderQueryOption(element.parentKey)
            );
            deleteElement(element.key);
          });
        } else {
          deleteFolder(element.key).then(() => {
            queryClient.invalidateQueries(
              readFolderQueryOption(element.parentKey)
            );
            deleteElement(element.key);
          });
        }
      });
    } else if (element.type === 'file') {
      deleteFile(element.parentKey, element.key).then(() => {
        queryClient.invalidateQueries(readFolderQueryOption(element.parentKey));
        deleteElement(element.key);
      });
    } else {
      deleteFolder(element.key).then(() => {
        queryClient.invalidateQueries(readFolderQueryOption(element.parentKey));
        deleteElement(element.key);
      });
    }
    currentMenu.style.display = 'none';
  };

  const handleRename = () => {
    if (!element || !currentMenu) return;
    startRenaming(element.key);
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
  if (selectedElements.length > 1) {
    currentMenuList = multipleMenuList;
  } else if (element?.type === 'file') {
    currentMenuList = fileMenuList;
  } else if (element?.type === 'folder') {
    currentMenuList = folderMenuList;
  }

  if (!element) return <></>;

  return <MenuGenerator menuList={currentMenuList} />;
};
