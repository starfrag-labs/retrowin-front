import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFolder } from '../../api/cloud';
import { MenuGenerator } from './MenuGenerator';
import { getRootFolderKeyQueryOption } from '../../utils/queryOptions/folder.query';
import { useWindowStore } from '../../store/window.store';
import { generateQueryKey } from '../../utils/queryOptions/index.query';

export const BackgroundOptionMenu = ({
  menuRef,
}: {
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const currentMenu = menuRef.current;
  const queryClient = useQueryClient();
  const rootKeyQuery = useQuery(getRootFolderKeyQueryOption());
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleUpload = () => {
    if (!currentMenu || !rootKeyQuery.isSuccess || !rootKeyQuery.data) return;
    newWindow(`${rootKeyQuery.data}_uploader`, 'uploader');
    currentMenu.style.display = 'none';
  };

  const handleCreateFolder = () => {
    if (!currentMenu || !rootKeyQuery.isSuccess || !rootKeyQuery.data) return;
    createFolder(rootKeyQuery.data, 'NewFolder').then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('folder', rootKeyQuery.data),
      })
    });
    currentMenu.style.display = 'none';
  };

  const handleRefresh = () => {
    if (!currentMenu || !rootKeyQuery.isSuccess || !rootKeyQuery.data) return;
    queryClient.invalidateQueries({
      queryKey: generateQueryKey('folder', rootKeyQuery.data),
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
