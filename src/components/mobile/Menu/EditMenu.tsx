import { MdDeleteOutline } from 'react-icons/md';
import { RiFolderTransferLine } from 'react-icons/ri';
import { CgRename } from 'react-icons/cg';
import { MdDownload } from 'react-icons/md';
import { editMenu, editMenuItemIcon } from '../../../styles/mobile/menu.css';
import { useEffect, useState } from 'react';
import { MoveMenu } from './MoveMenu';
import { Modal } from '../Modal';
import {
  deleteFile,
  deleteFolder,
  downloadFile,
  renameFile,
  renameFolder,
} from '../../../api/cloud';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { readFolderQueryOption } from '../../../utils/queryOptions/folder.query';
import { useMobileElementStore } from '../../../store/mobile/element.store';

export const EditMenu = ({ folderKey }: { folderKey: string }) => {
  const readQuery = useQuery(readFolderQueryOption(folderKey));

  const queryClient = useQueryClient();

  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  // Store
  const selectedKeys = useMobileElementStore((state) => state.selectedKeys);

  // Actions
  const isSelected = useMobileElementStore((state) => state.isSelected);
  const unselectAllKeys = useMobileElementStore(
    (state) => state.unselectAllKeys
  );
  const unselectKey = useMobileElementStore((state) => state.unselectKey);

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
    if (readQuery.isLoading || !readQuery.data) {
      return;
    }

    await Promise.all([
      readQuery.data.folders.forEach(
        (folder) => isSelected(folder.key) && deleteFolder(folder.key)
      ),
      readQuery.data.files.forEach(
        (file) => isSelected(file.key) && deleteFile(file.key)
      ),
    ]).then(() => {
      queryClient.invalidateQueries(readFolderQueryOption(folderKey));
      unselectAllKeys();
    });
  };

  const handleRename = async () => {
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
      await renameFolder(folder.key, modifiedNewName).then(() => {
        queryClient.invalidateQueries(readFolderQueryOption(folder.parentKey));
      });
    } else if (file && file.name !== modifiedNewName) {
      await renameFile(file.key, modifiedNewName).then(() => {
        queryClient.invalidateQueries(readFolderQueryOption(file.parentKey));
      });
    }

    unselectKey(selectedKeys[0]);
    setNewName('');
    toggleRenameModalOpen();
  };

  const handleDownload = async () => {
    if (selectedKeys.length === 0) {
      return;
    }
    if (readQuery.isLoading || !readQuery.data) {
      return;
    }

    const selectedFiles = readQuery.data.files.filter((file) =>
      isSelected(file.key)
    );

    toggleDownloadModalOpen();
    unselectAllKeys();

    selectedFiles.forEach(async (file) => {
      await downloadFile(file.key, file.name).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
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
          />
        </Modal>
      )}
      {deleteModalOpen && (
        <Modal onAccept={handleDelete} onClose={toggleDeleteModalOpen}>
          <div>
            Are you sure you want to delete {selectedKeys.length}{' '}
            {selectedKeys.length === 1 ? 'item' : 'items'}?
          </div>
        </Modal>
      )}
      {moveMenuOpen && <MoveMenu folderKey={folderKey} toggle={toggleMoving} />}
      {downloadModalOpen && (
        <Modal onAccept={handleDownload} onClose={toggleDownloadModalOpen}>
          <div>
            Are you sure you want to download {selectedKeys.length}{' '}
            {selectedKeys.length === 1 ? 'item' : 'items'}?
          </div>
        </Modal>
      )}
    </div>
  );
};
