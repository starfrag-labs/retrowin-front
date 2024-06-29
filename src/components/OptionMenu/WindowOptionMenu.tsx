import { useQueryClient } from '@tanstack/react-query';
import { createFolder } from '../../api/cloud';
import { useTokenStore } from '../../store/token.store';
import { MenuGenerator } from './MenuGenerator';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { useWindowStoreV2 } from '../../store/window.store.v2';

export const WindowOptionsMenu = ({
  windowKey,
  menuRef,
}: {
  windowKey: string;
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const queryClient = useQueryClient();

  // refs
  const currentMenu = menuRef.current;

  // store states
  const accessToken = useTokenStore((state) => state.accessToken);
  const window = useWindowStoreV2((state) => state.findWindow(windowKey));

  // store functions
  const newWindow = useWindowStoreV2((state) => state.newWindow);

  const handleUpload = () => {
    if (!currentMenu || !window) return;
    newWindow(`${window.targetKey}_uploader`, 'uploader');
    currentMenu.style.display = 'none';
  };

  const handleCreateFolder = () => {
    if (!currentMenu || !window) return;
    createFolder(accessToken, window.targetKey, 'NewFolder').then(() => {
      queryClient.invalidateQueries(
        readFolderQueryOption(accessToken, window.targetKey)
      );
    });
    currentMenu.style.display = 'none';
  };

  const handleRefresh = () => {
    if (!currentMenu || !window) return;
    queryClient.invalidateQueries(
      readFolderQueryOption(accessToken, window.targetKey)
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
