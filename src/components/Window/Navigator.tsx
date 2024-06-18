import { useQueryClient } from '@tanstack/react-query';
import { Elements } from '../Elements';
import { useTokenStore } from '../../store/token.store';
import { useElementStore } from '../../store/element.store';
import { useEffect, useState } from 'react';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { IElementState } from '../../types/store';
import { navigatorContainer } from '../../styles/windows/navigator.css';

export const Navigator = ({ folderKey }: { folderKey: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const queryClient = useQueryClient();
  const accessToken = useTokenStore.getState().accessToken;
  const setElements = useElementStore((state) => state.addElements);
  useEffect(() => {
    queryClient
      .ensureQueryData(readFolderQueryOption(accessToken, folderKey))
      .then((data) => {
        const folderElements: IElementState[] = data.folders.map((folder) => ({
          key: folder.key,
          name: folder.name,
          type: 'folder',
          parentKey: folderKey,
          selected: false,
          renaming: false,
        }));
        const fileElements: IElementState[] = data.files.map((file) => ({
          key: file.key,
          name: file.name,
          type: 'file',
          parentKey: folderKey,
          selected: false,
          renaming: false,
        }));

        setElements([...folderElements, ...fileElements]);
        setIsLoaded(true);
      });
  }, [accessToken, folderKey, queryClient, setElements]);

  return (
    <div className={navigatorContainer}>
      {isLoaded && (
        <Elements folderKey={folderKey} isWindowElements/>
      )}
    </div>
  );
};
