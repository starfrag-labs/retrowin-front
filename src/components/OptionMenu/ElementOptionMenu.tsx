import { useElementStore } from '../../store/element.store';
import { useTokenStore } from '../../store/token.store';
import { deleteFile, deleteFolder, downloadFile } from '../../api/cloud';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { MenuGenerator } from './MenuGenerator';
import { useWindowStore } from '../../store/window.store';

export const ElementOptionMenu = ({
  elementKey,
  menuRef,
}: {
  elementKey: string;
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const currentMenu = menuRef.current;
  const element = useElementStore((state) => state.findElement(elementKey));
  const accessToken = useTokenStore((state) => state.accessToken);
  const addElement = useElementStore((state) => state.addElement);
  const startRenaming = useElementStore((state) => state.startRenaming);
  const deleteElement = useElementStore((state) => state.deleteElement);
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleDownload = () => {
    if (!element || !currentMenu) return;
    downloadFile(accessToken, element.parentKey, element.key).then(
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
      downloadFile(accessToken, element.parentKey, element.key).then(
        (response) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: contentType })
          );
          window.open(url, '_blank');
        }
      );
    } else if (element.type === 'folder') {
      newWindow(element.key, 'navigator');
    }
    currentMenu.style.display = 'none';
  };

  const handleDelete = () => {
    if (!element || !currentMenu) return;
    const tempElement = element;
    deleteElement(element.key);
    if (element.type === 'file') {
      deleteFile(accessToken, element.key, '').catch(() => {
        addElement(tempElement);
      });
    } else {
      deleteFolder(accessToken, element.key)
        .catch((e) => {
          console.log(e);

          addElement(tempElement);
        })
        .then((response) => {
          console.log(response);
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

  if (!element) return <></>;

  return (
    <MenuGenerator
      menuList={element.type === 'file' ? fileMenuList : folderMenuList}
    />
  );
};
