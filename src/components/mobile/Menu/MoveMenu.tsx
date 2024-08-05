import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFolderInfoQueryOption,
  getFolderPathQueryOption,
  moveFolderMutationOption,
  readFolderQueryOption,
} from '../../../utils/queryOptions/folder.query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaFolder } from 'react-icons/fa';
import { RiFolderTransferLine } from 'react-icons/ri';
import { miniFolderIcon } from '../../../styles/mobile/element.css';
import { CircularLoading } from '../../pc/CircularLoading';
import {
  leftJustifiedMenuLabel,
  menu,
  menuContainer,
} from '../../../styles/mobile/menu.css';
import { Modal } from '../Modal';
import { useElementStore } from '../../../store/element.store';
import { generateQueryKey } from '../../../utils/queryOptions/index.query';
import { moveFileMutationOption } from '../../../utils/queryOptions/file.query';

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
  const readCurrentFolderQuery = useQuery(readFolderQueryOption(folderKey));
  const readQuery = useQuery(readFolderQueryOption(targetFolderKey));
  const infoQuery = useQuery(getFolderInfoQueryOption(targetFolderKey));
  const pathQuery = useQuery(getFolderPathQueryOption(targetFolderKey));

  // Mutations
  const moveFile = useMutation(moveFileMutationOption);
  const moveFolder = useMutation(moveFolderMutationOption);

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
    toggle();
    if (readQuery.isLoading || !readQuery.data || !readCurrentFolderQuery.data) {
      return;
    }
    const folderPromise = readCurrentFolderQuery.data.folders
      .filter((folder) => isSelected(folder.key))
      .map((folder) =>
        moveFolder.mutateAsync({
          folderKey: folder.key,
          targetKey: targetFolderKey,
        })
      );
    const filePromise = readCurrentFolderQuery.data.files
      .filter((file) => isSelected(file.key))
      .map((file) =>
        moveFile.mutateAsync({
          fileKey: file.key,
          targetKey: targetFolderKey,
        })
      );
    await Promise.all([...folderPromise, ...filePromise]).then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('folder'),
      });
      unselectAllKeys();
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
