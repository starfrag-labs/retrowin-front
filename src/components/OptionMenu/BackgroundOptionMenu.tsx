import { useTokenStore } from '../../store/token.store';
import { MenuGenerator } from './MenuGenerator';

export const BackgroundOptionMenu = ({
  menuRef,
}: {
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const currentMenu = menuRef.current;
  const accessToken = useTokenStore((state) => state.accessToken);

  const handleUpload = () => {
    if (!currentMenu) return;
    currentMenu.style.display = 'none';
  };

  const handleCreateFolder = () => {
    if (!currentMenu) return;
    currentMenu.style.display = 'none';
  };

  const handleRefresh = () => {
    if (!currentMenu) return;
    currentMenu.style.display = 'none';
  };

  const menuList = [
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

  return <MenuGenerator menuList={menuList} />;
};
