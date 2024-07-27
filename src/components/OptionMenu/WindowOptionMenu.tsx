import { useQueryClient } from '@tanstack/react-query';
import { createFolder } from '../../api/cloud';
import { MenuGenerator } from './MenuGenerator';
import { useWindowStore } from '../../store/window.store';
import { generateQueryKey } from '../../utils/queryOptions/index.query';

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
  const window = useWindowStore((state) => state.findWindow(windowKey));

  // store functions
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleUpload = () => {
    if (!currentMenu || !window) return;
    newWindow(`${window.targetKey}_uploader`, 'uploader');
    currentMenu.style.display = 'none';
  };

  const handleCreateFolder = () => {
    if (!currentMenu || !window) return;
    createFolder(window.targetKey, 'NewFolder').then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('folder', window.targetKey),
      });
    });
    currentMenu.style.display = 'none';
  };

  const handleRefresh = () => {
    if (!currentMenu || !window) return;
    queryClient.invalidateQueries({
      queryKey: generateQueryKey('folder', window.targetKey),
    });
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
