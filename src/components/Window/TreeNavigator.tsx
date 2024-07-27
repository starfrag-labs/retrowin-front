import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  getFolderInfoQueryOption,
  readFolderQueryOption,
} from '../../utils/queryOptions/folder.query';
import {
  emptySpace,
  tree,
  treeFolder,
  treeFolderName,
} from '../../styles/windows/navigator.css';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

export const TreeNavigator = ({
  folderKey,
  isRoot = false,
  initialIsOpened = false,
  level = 0,
}: {
  folderKey: string;
  isRoot?: boolean;
  initialIsOpened?: boolean;
  level?: number;
}): React.ReactElement => {
  const readTargetFolderQuery = useQuery(readFolderQueryOption(folderKey));
  const getFolderInfoQuery = useQuery(getFolderInfoQueryOption(folderKey));

  const [isOpened, setIsOpened] = React.useState<boolean>(initialIsOpened);

  const toggleOpen = () => {
    setIsOpened(!isOpened);
  };

  if (readTargetFolderQuery.isFetching) return <p>Loading...</p>;

  if (readTargetFolderQuery.isError) return <p>Error</p>;

  if (!readTargetFolderQuery.data || !getFolderInfoQuery.data)
    return <p>No data</p>;

  return (
    <div className={tree}>
      <div
        className={treeFolder}
        style={{
          paddingLeft: `${level * 0.5}rem`,
        }}
      >
        {readTargetFolderQuery.data.folders.length > 0 ? (
          isOpened ? (
            <IoIosArrowDown onClick={toggleOpen} />
          ) : (
            <IoIosArrowForward onClick={toggleOpen} />
          )
        ) : (
          <div className={emptySpace} />
        )}
        <div onClick={toggleOpen} className={treeFolderName}>
          {isRoot ? 'root' : getFolderInfoQuery.data.name}
        </div>
      </div>
      {isOpened &&
        readTargetFolderQuery.data.folders.map((folder) => (
          <TreeNavigator
            folderKey={folder.key}
            key={folder.key}
            level={level + 1}
          />
        ))}
    </div>
  );
};
