import { useQueryClient } from '@tanstack/react-query';
import { Elements } from '../Elements';
import { Selector } from '../Selector';
import { useTokenStore } from '../../store/token.store';
import { useElementStore } from '../../store/element.store';
import { useCallback, useEffect, useState } from 'react';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { useWindowStore } from '../../store/window.store';
import { windowContainer } from '../../styles/window.css';
import { IElementState } from '../../types/store';

export const Navigator = ({ folderKey }: { folderKey: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const queryClient = useQueryClient();
  const accessToken = useTokenStore.getState().accessToken;
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const setElements = useElementStore((state) => state.addElements);

  const handleCloseWindow = () => {
    closeWindow(folderKey);
  };

  const queryElements = useCallback(async () => {
    await queryClient
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

  useEffect(() => {
    queryElements();
  }, [queryElements]);

  return (
    <div className={windowContainer}>
      <div className="header">
        <button onClick={handleCloseWindow}>X</button>
      </div>
      {isLoaded && (
        <Selector>
          <Elements folderKey={folderKey} />
        </Selector>
      )}
    </div>
  );
};
