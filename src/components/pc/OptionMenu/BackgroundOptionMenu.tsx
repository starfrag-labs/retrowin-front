import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MenuGenerator } from './MenuGenerator';
import {
  createFolderMutationOption,
  getRootFolderKeyQueryOption,
} from '../../../utils/queryOptions/folder.query';
import { useWindowStore } from '../../../store/window.store';
import { generateQueryKey } from '../../../utils/queryOptions/index.query';

export const BackgroundOptionMenu = ({
  menuRef,
}: {
  menuRef: React.RefObject<HTMLDivElement>;
}): React.ReactElement => {
  const currentMenu = menuRef.current;
  const queryClient = useQueryClient();
  const rootKeyQuery = useQuery(getRootFolderKeyQueryOption());

  // Mutations
  const createFolder = useMutation(createFolderMutationOption);

  // Store functions
  const newWindow = useWindowStore((state) => state.newWindow);

  const handleUpload = () => {
    if (!currentMenu || !rootKeyQuery.isSuccess || !rootKeyQuery.data) return;
    newWindow(`${rootKeyQuery.data}_uploader`, 'uploader');
    currentMenu.style.display = 'none';
  };

  const handleCreateFolder = () => {
    if (!currentMenu || !rootKeyQuery.isSuccess || !rootKeyQuery.data) return;
    createFolder
      .mutateAsync({
        parentKey: rootKeyQuery.data,
        folderName: 'NewFolder',
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: generateQueryKey('folder', rootKeyQuery.data),
        });
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
