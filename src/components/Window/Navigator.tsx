import { useQuery } from '@tanstack/react-query';
import { Elements } from '../Elements';
import { useEffect } from 'react';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { navigatorContainer } from '../../styles/windows/navigator.css';

export const Navigator = ({
  folderKey,
  setLoading,
}: {
  folderKey: string;
  setLoading: (loading: boolean) => void;
}): React.ReactElement => {
  const readQuery = useQuery(readFolderQueryOption(folderKey));
  
  useEffect(() => {
    if (readQuery.isFetching) setLoading(true);
    else setLoading(false);
  })

  return (
    <div className={navigatorContainer}>
      <Elements folderKey={folderKey} isWindowElements />
    </div>
  );
};
