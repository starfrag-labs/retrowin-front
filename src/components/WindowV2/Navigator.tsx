import { useQuery } from '@tanstack/react-query';
import { Elements } from '../Elements';
import { useTokenStore } from '../../store/token.store';
import { useElementStore } from '../../store/element.store';
import { useEffect } from 'react';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { IElementState } from '../../types/store';
import { navigatorContainer } from '../../styles/windows/navigator.css';

export const Navigator = ({
  folderKey,
  setLoading,
}: {
  folderKey: string;
  setLoading: (loading: boolean) => void;
}): React.ReactElement => {
  const accessToken = useTokenStore.getState().accessToken;
  const query = useQuery(readFolderQueryOption(accessToken, folderKey));
  const setElements = useElementStore((state) => state.addElements);
  
  useEffect(() => {
    const data = query.data;
    if (!data) return;
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
  }, [folderKey, query.data, setElements]);

  useEffect(() => {
    if (query.isFetching) setLoading(true);
    else setLoading(false);
  })

  return (
    <div className={navigatorContainer}>
      <Elements folderKey={folderKey} isWindowElements />
    </div>
  );
};
