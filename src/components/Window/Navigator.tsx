import { useQuery } from '@tanstack/react-query';
import { Elements } from '../Elements';
import { useEffect } from 'react';
import { getRootFolderKeyQueryOption, readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { navigatorContainer } from '../../styles/windows/navigator.css';
import { TreeNavigator } from './TreeNavigator';

export const Navigator = ({
  folderKey,
  setLoading,
}: {
  folderKey: string;
  setLoading: (loading: boolean) => void;
}): React.ReactElement => {
  const readQuery = useQuery(readFolderQueryOption(folderKey));
  const getRootKeyQuery = useQuery(getRootFolderKeyQueryOption());
  
  useEffect(() => {
    if (readQuery.isFetching) setLoading(true);
    else setLoading(false);
  }, [readQuery.isFetching, setLoading])

  if (readQuery.isError || getRootKeyQuery.isError) return <p>Error</p>;

  if (!readQuery.data || !getRootKeyQuery.data) return <p>No data</p>;

  return (
    <div className={navigatorContainer}>
      {getRootKeyQuery.data && <TreeNavigator folderKey={getRootKeyQuery.data} />}
      <Elements folderKey={folderKey} isWindowElements />
    </div>
  );
};
