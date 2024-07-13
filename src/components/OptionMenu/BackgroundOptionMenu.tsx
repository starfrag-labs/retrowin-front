import { useQueryClient } from '@tanstack/react-query';
import { createFolder } from '../../api/cloud';
import { useElementStore } from '../../store/element.store';
import { MenuGenerator } from './MenuGenerator';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { useWindowStore } from '../../store/window.store';

export const BackgroundOptionMenu = ({
  menuRef,
}: {
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const currentMenu = menuRef.current;
  const queryClient = useQueryClient();
  const rootElement = useElementStore(
    (state) => state.getElementsByParentKey('')[0]
  );
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleUpload = () => {
    if (!currentMenu) return;
    newWindow(`${rootElement.key}_uploader`, 'uploader');
    currentMenu.style.display = 'none';
  };

  const handleCreateFolder = () => {
    if (!currentMenu) return;
    createFolder(rootElement.key, 'NewFolder').then(() => {
      queryClient.invalidateQueries(readFolderQueryOption(rootElement.key));
    });
    currentMenu.style.display = 'none';
  };

  const handleRefresh = () => {
    if (!currentMenu) return;
    queryClient.invalidateQueries(readFolderQueryOption(rootElement.key));
    currentMenu.style.display = 'none';
  };

  const backgroundMenuList = [
    {
      name: 'Upload',
      action: handleUpload,
    },
    {
      name: 'Create Folder',
      action: handleCreateFolder,
    },
    {
      name: '/',
      action: () => {},
    },
    {
      name: 'Refresh',
      action: handleRefresh,
    },
  ];

  return <MenuGenerator menuList={backgroundMenuList} />;
};
