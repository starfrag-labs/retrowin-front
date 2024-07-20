import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFolderInfoQueryOption,
  getFolderPathQueryOption,
  readFolderQueryOption,
} from '../../../utils/queryOptions/folder.query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaFolder } from 'react-icons/fa';
import { RiFolderTransferLine } from 'react-icons/ri';
import { miniFolderIcon } from '../../../styles/mobile/element.css';
import { Loading } from '../../Loading';
import {
  leftJustifiedMenuLabel,
  menu,
  menuContainer,
} from '../../../styles/mobile/menu.css';
import { useMobileElementStore } from '../../../store/mobile/element.store';
import { Modal } from '../Modal';
import { moveFile } from '../../../api/cloud';

export const MoveMenu = ({
  folderKey,
  toggle,
}: {
  folderKey: string;
  toggle: () => void;
}) => {
  const queryClient = useQueryClient();
  // States
  const [path, setPath] = useState<string>('');
  const [parentKey, setParentKey] = useState<string>('');
  const [currentFolderKey, setCurrentFolderKey] = useState<string>(folderKey);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedElements = useMobileElementStore((state) =>
    state.elements.filter((element) => element.selected)
  );

  // Actions
  const unselectAll = useMobileElementStore(
    (state) => state.unselectAllElements
  );
  const moveElement = useMobileElementStore((state) => state.moveElement);

  // Queries
  const readQuery = useQuery(readFolderQueryOption(currentFolderKey));
  const infoQuery = useQuery(getFolderInfoQueryOption(currentFolderKey));
  const pathQuery = useQuery(getFolderPathQueryOption(currentFolderKey));

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

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

  const handleMove = () => {
    selectedElements.forEach(async (element) => {
      await moveFile(element.parentKey, element.key, currentFolderKey).then(
        () => {
          queryClient.invalidateQueries(
            readFolderQueryOption(element.parentKey)
          );
          queryClient.invalidateQueries(
            readFolderQueryOption(currentFolderKey)
          );
          moveElement(element.key, currentFolderKey);
        }
      );
    });
    unselectAll();
    toggle();
  };

  // Setup path for modal
  useEffect(() => {
    if (pathQuery.isSuccess && pathQuery.data) {
      if (pathQuery.data.length === 1) {
        setPath('/');
        return;
      }
      setPath(
        pathQuery.data
          .flatMap((name) => {
            if (name !== '/') {
              return name;
            } else {
              return '';
            }
          })
          .join('/')
      );
    }
  }, [pathQuery.data, pathQuery.isSuccess]);

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
          <div className={leftJustifiedMenuLabel} onTouchEnd={toggleModal}>
            <RiFolderTransferLine className={miniFolderIcon} />
            Move Here
          </div>
          {modalOpen && (
            <Modal onAccept={handleMove} onClose={toggleModal}>
              <div>Move to {path}</div>
            </Modal>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};
