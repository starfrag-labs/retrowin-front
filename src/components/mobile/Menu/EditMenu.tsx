import { MdDeleteOutline } from 'react-icons/md';
import { RiFolderTransferLine } from 'react-icons/ri';
import { CgRename } from 'react-icons/cg';
import { MdDownload } from 'react-icons/md';
import { editMenu, editMenuItemIcon } from '../../../styles/mobile/menu.css';
import { useEffect, useState } from 'react';
import { MoveMenu } from './MoveMenu';
import { Modal } from '../Modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteFolderMutationOption,
  readFolderQueryOption,
  renameFolderMutationOption,
} from '../../../utils/queryOptions/folder.query';
import { useElementStore } from '../../../store/element.store';
import { modalInput } from '../../../styles/mobile/modal.css';
import { generateQueryKey } from '../../../utils/queryOptions/index.query';
import {
  deleteFileMutationOption,
  downloadFileQueryOption,
  renameFileMutationOption,
} from '../../../utils/queryOptions/file.query';

export const EditMenu = ({ folderKey }: { folderKey: string }) => {
  const readQuery = useQuery(readFolderQueryOption(folderKey));

  const queryClient = useQueryClient();

  //Mutations
  const deleteFile = useMutation(deleteFileMutationOption);
  const deleteFolder = useMutation(deleteFolderMutationOption);
  const renameFile = useMutation(renameFileMutationOption);
  const renameFolder = useMutation(renameFolderMutationOption);

  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  // Store
  const selectedKeys = useElementStore((state) => state.selectedKeys);

  // Actions
  const isSelected = useElementStore((state) => state.isSelected);
  const unselectAllKeys = useElementStore((state) => state.unselectAllKeys);
  const unselectKey = useElementStore((state) => state.unselectKey);

  // Functions
  const toggleMoving = () => {
    setMoveMenuOpen(!moveMenuOpen);
  };

  const toggleRenameModalOpen = () => {
    if (selectedKeys.length !== 1) {
      return;
    }
    if (readQuery.isLoading || !readQuery.data) {
      return;
    }
    const element =
      readQuery.data.files.find((file) => file.key === selectedKeys[0]) ||
      readQuery.data.folders.find((folder) => folder.key === selectedKeys[0]);

    if (element) {
      setNewName(element.name);
      setRenameModalOpen(!renameModalOpen);
    }
  };

  const toggleDeleteModalOpen = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const toggleDownloadModalOpen = () => {
    setDownloadModalOpen(!downloadModalOpen);
  };

  const handleDelete = async () => {
    toggleDeleteModalOpen();
    if (readQuery.isLoading || !readQuery.data) {
      return;
    }
    const folderPromise = readQuery.data.folders
      .filter((folder) => isSelected(folder.key))
      .map((folder) => deleteFolder.mutateAsync(folder.key));
    const filePromise = readQuery.data.files
      .filter((file) => isSelected(file.key))
      .map((file) => deleteFile.mutateAsync(file.key));

    await Promise.all([...folderPromise, ...filePromise]).then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('folder'),
      });
      unselectAllKeys();
    });
  };

  const handleRename = async () => {
    toggleRenameModalOpen();
    if (selectedKeys.length !== 1 || newName === '') {
      return;
    }
    if (readQuery.isLoading || !readQuery.data) {
      return;
    }
    const file = readQuery.data.files.find(
      (file) => file.key === selectedKeys[0]
    );
    const folder = readQuery.data.folders.find(
      (folder) => folder.key === selectedKeys[0]
    );

    // replace all spaces with _ and trim the name
    // if extname is empty, add it to the name
    let modifiedNewName = newName.trim().replace(/\s/g, '_');

    if (file) {
      const newExtName = modifiedNewName.match(/\.[0-9a-z]+$/i)?.[0] || '';
      const extname = file.name.match(/\.[0-9a-z]+$/i)?.[0] || '';

      if (newExtName === '') {
        modifiedNewName = `${modifiedNewName}${extname}`;
      }
    }

    if (folder && folder.name !== modifiedNewName) {
      await renameFolder
        .mutateAsync({
          folderKey: folder.key,
          folderName: modifiedNewName,
        })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('folder', folderKey),
          });
        });
    } else if (file && file.name !== modifiedNewName) {
      await renameFile
        .mutateAsync({
          fileKey: file.key,
          fileName: modifiedNewName,
        })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('folder', folderKey),
          });
        });
    }
    unselectKey(selectedKeys[0]);
    setNewName('');
  };

  const handleDownload = async () => {
    toggleDownloadModalOpen();
    if (selectedKeys.length === 0) {
      return;
    }
    if (readQuery.isLoading || !readQuery.data) {
      return;
    }

    const selectedFiles = readQuery.data.files.filter((file) =>
      isSelected(file.key)
    );
    unselectAllKeys();
    selectedFiles.forEach(async (file) => {
      queryClient
        .ensureQueryData(downloadFileQueryOption(file.key, file.name))
        .then((response) => {
          const url = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.name);
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    });
  };

  useEffect(() => {
    if (readQuery.isLoading || !readQuery.data) {
      return;
    }
    setIsFolderSelected(
      readQuery.data.folders.some((folder) => isSelected(folder.key))
    );
  }, [isSelected, readQuery.data, readQuery.isLoading]);

  return (
    <div className={editMenu}>
      <MdDeleteOutline
        className={editMenuItemIcon}
        onTouchEnd={toggleDeleteModalOpen}
      />
      <RiFolderTransferLine
        className={editMenuItemIcon}
        onTouchEnd={toggleMoving}
      />
      {selectedKeys.length === 1 && (
        <CgRename
          className={editMenuItemIcon}
          onTouchEnd={toggleRenameModalOpen}
        />
      )}
      {!isFolderSelected && (
        <MdDownload
          className={editMenuItemIcon}
          onTouchEnd={toggleDownloadModalOpen}
        />
      )}
      {renameModalOpen && (
        <Modal onAccept={handleRename} onClose={toggleRenameModalOpen}>
          <input
            type="text"
            onChange={(e) => setNewName(e.target.value)}
            defaultValue={newName}
            className={modalInput}
          />
        </Modal>
      )}
      {deleteModalOpen && (
        <Modal onAccept={handleDelete} onClose={toggleDeleteModalOpen}>
          Are you sure you want to delete {selectedKeys.length}{' '}
          {selectedKeys.length === 1 ? 'item' : 'items'}?
        </Modal>
      )}
      {moveMenuOpen && <MoveMenu folderKey={folderKey} toggle={toggleMoving} />}
      {downloadModalOpen && (
        <Modal onAccept={handleDownload} onClose={toggleDownloadModalOpen}>
          Are you sure you want to download {selectedKeys.length}{' '}
          {selectedKeys.length === 1 ? 'item' : 'items'}?
        </Modal>
      )}
    </div>
  );
};
