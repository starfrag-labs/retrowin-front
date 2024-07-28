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
import { CircularLoading } from '../../CircularLoading';
import {
  leftJustifiedMenuLabel,
  menu,
  menuContainer,
} from '../../../styles/mobile/menu.css';
import { Modal } from '../Modal';
import { moveFile, moveFolder } from '../../../api/cloud';
import { useElementStore } from '../../../store/element.store';
import { generateQueryKey } from '../../../utils/queryOptions/index.query';

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
  const [targetFolderKey, setTargetFolderKey] = useState<string>(folderKey);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);

  // Actions
  const isSelected = useElementStore((state) => state.isSelected);
  const unselectAllKeys = useElementStore((state) => state.unselectAllKeys);

  // Queries
  const readQuery = useQuery(readFolderQueryOption(targetFolderKey));
  const infoQuery = useQuery(getFolderInfoQueryOption(targetFolderKey));
  const pathQuery = useQuery(getFolderPathQueryOption(targetFolderKey));

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

  const handleMove = async () => {
    if (readQuery.isLoading || !readQuery.data) {
      return;
    }
    await Promise.all([
      readQuery.data.files.forEach(async (file) => {
        if (isSelected(file.key)) {
          await moveFile(file.key, targetFolderKey);
        }
      }),
      readQuery.data.folders.forEach(async (folder) => {
        if (isSelected(folder.key)) {
          await moveFolder(folder.key, targetFolderKey);
        }
      }),
    ]).then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('folder', targetFolderKey),
      });
      unselectAllKeys();
      toggle();
    });
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
              onTouchEnd={() => setTargetFolderKey(parentKey)}
              className={leftJustifiedMenuLabel}
            >
              <FaFolder className={miniFolderIcon} />
              ..
            </div>
          )}
          {readQuery.data.folders.map((folder) => (
            <div
              key={folder.key}
              onTouchEnd={() => setTargetFolderKey(folder.key)}
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
              Move to {path}
            </Modal>
          )}
        </div>
      ) : (
        <CircularLoading />
      )}
    </div>
  );
};
