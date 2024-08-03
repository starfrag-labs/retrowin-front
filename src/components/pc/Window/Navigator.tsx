import { useQuery } from '@tanstack/react-query';
import { Elements } from '../Elements';
import { useEffect } from 'react';
import { readFolderQueryOption } from '../../../utils/queryOptions/folder.query';
import {
  itemContainer,
  navigatorContainer,
} from '../../../styles/pc/windows/navigator.css';
import { FavoriteSidebar } from './FavoriteSidebar';
import { sidebarContainer } from '../../../styles/pc/windows/sidebar.css';
import { useWindowStore } from '../../../store/window.store';

export const Navigator = ({
  folderKey,
  setLoading,
}: {
  folderKey: string;
  setLoading: (loading: boolean) => void;
}): React.ReactElement => {
  const readQuery = useQuery(readFolderQueryOption(folderKey));
  const window = useWindowStore((state) => state.findWindowByTarget(folderKey));

  useEffect(() => {
    if (readQuery.isFetching) setLoading(true);
    else setLoading(false);
  }, [readQuery.isFetching, setLoading]);

  if (readQuery.isError) return <p>Error</p>;

  if (!readQuery.data) return <p>No data</p>;

  if (!window) return <p>Window not found</p>;

  return (
    <div className={navigatorContainer}>
      <div className={sidebarContainer}>
        <FavoriteSidebar windowKey={window?.key} />
      </div>
      <div className={itemContainer}>
        <Elements folderKey={folderKey} isWindowElements />
      </div>
    </div>
  );
};
