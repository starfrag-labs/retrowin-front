import { useQueryClient } from '@tanstack/react-query';
import { createFolder } from '../../api/cloud';
import { useElementStore } from '../../store/element.store';
import { useTokenStore } from '../../store/token.store';
import { MenuGenerator } from './MenuGenerator';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { useWindowStoreV2 } from '../../store/window.store.v2';

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
  const accessToken = useTokenStore((state) => state.accessToken);
  const newWindow = useWindowStoreV2((state) => state.newWindow);

  const handleUpload = () => {
    if (!currentMenu) return;
    newWindow(`${rootElement.key}_uploader`, 'uploader');
    currentMenu.style.display = 'none';
  };

  const handleCreateFolder = () => {
    if (!currentMenu) return;
    createFolder(accessToken, rootElement.key, 'NewFolder').then(() => {
      queryClient.invalidateQueries(
        readFolderQueryOption(accessToken, rootElement.key)
      );
    });
    currentMenu.style.display = 'none';
  };

  const handleRefresh = () => {
    if (!currentMenu) return;
    queryClient.invalidateQueries(
      readFolderQueryOption(accessToken, rootElement.key)
    );
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
