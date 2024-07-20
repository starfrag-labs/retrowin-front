import { useQuery } from '@tanstack/react-query';
import {
  getFolderInfoQueryOption,
  readFolderQueryOption,
} from '../../../utils/queryOptions/folder.query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaFolder } from 'react-icons/fa';
import { miniFolderIcon } from '../../../styles/mobile/element.css';
import { Loading } from '../../Loading';
import {
  leftJustifiedMenuLabel,
  menu,
  menuContainer,
} from '../../../styles/mobile/menu.css';
import { useMobileElementStore } from '../../../store/mobile/element.store';

export const MoveMenu = ({
  folderKey,
  toggle,
}: {
  folderKey: string;
  toggle: () => void;
}) => {
  // States
  const [parentKey, setParentKey] = useState<string>('');
  const [currentFolderKey, setCurrentFolderKey] = useState<string>(folderKey);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);

  // Actions
  const unselectAll = useMobileElementStore((state) => state.unselectAllElements);

  // Queries
  const readQuery = useQuery(readFolderQueryOption(currentFolderKey));
  const infoQuery = useQuery(
    getFolderInfoQueryOption(currentFolderKey)
  );

  const handleCloseMenu = useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length > 1) {
        return;
      }
      if (menuRef.current) {
        if (!menuRef.current.contains(event.target as Node)) {
          toggle();
        }
      }
    },
    [toggle]
  );

  useEffect(() => {
    setParentKey('');
    if (infoQuery.isSuccess && infoQuery.data) {
      setParentKey(infoQuery.data.parentKey);
    }
  }, [infoQuery.data, infoQuery.isSuccess]);

  return (
    <div className={menuContainer} onTouchEnd={handleCloseMenu}>
      {infoQuery.isSuccess &&
      infoQuery.data &&
      readQuery.isSuccess &&
      readQuery.data ? (
        <div className={menu} ref={menuRef}>
          {parentKey && (
            <div
              onTouchEnd={() => setCurrentFolderKey(parentKey)}
              className={leftJustifiedMenuLabel}
            >
              <FaFolder className={miniFolderIcon} />
              ..
            </div>
          )}
          {readQuery.data.folders.map((folder) => (
            <div
              key={folder.key}
              onTouchEnd={() => setCurrentFolderKey(folder.key)}
              className={leftJustifiedMenuLabel}
            >
              <FaFolder className={miniFolderIcon} />
              {folder.name}
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};
