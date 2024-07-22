import { useMobileElementStore } from '../../../store/mobile/element.store';
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
import { IMobileElementState } from '../../../types/store';
import { useQueryClient } from '@tanstack/react-query';
import { readFolderQueryOption } from '../../../utils/queryOptions/folder.query';

export const EditMenu = ({ folderKey }: { folderKey: string }) => {
  const queryClient = useQueryClient();

  const [selectedElements, setSelectedElements] = useState<
    IMobileElementState[]
  >([]);
  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  // Store
  const elements = useMobileElementStore((state) => state.elements);

  // Actions
  const unselectAll = useMobileElementStore(
    (state) => state.unselectAllElements
  );
  const renameElement = useMobileElementStore((state) => state.renameElement);
  const deleteElement = useMobileElementStore((state) => state.deleteElement);

  // Functions
  const toggleMoving = () => {
    setMoveMenuOpen(!moveMenuOpen);
  };

  const toggleRenameModalOpen = () => {
    setRenameModalOpen(!renameModalOpen);
  };

  const toggleDeleteModalOpen = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const toggleDownloadModalOpen = () => {
    setDownloadModalOpen(!downloadModalOpen);
  };

  const handleDelete = async () => {
    if (selectedElements.length === 0) {
      return;
    }
    const selectedFolders = selectedElements.filter(
      (element) => element.type === 'folder'
    );
    const selectedFiles = selectedElements.filter(
      (element) => element.type === 'file'
    );

    await Promise.all([
      selectedFolders.map((folder) => deleteFolder(folder.key)),
      selectedFiles.map((file) => deleteFile(file.key)),
    ]).then(() => {
      selectedElements.forEach((element) => {
        deleteElement(element.key);
        queryClient.invalidateQueries(readFolderQueryOption(element.parentKey));
      });
      unselectAll();
    });
  };

  const handleRename = async () => {
    if (selectedElements.length !== 1 || newName === '') {
      return;
    }
    const element = selectedElements[0];

    // replace all spaces with _ and trim the name
    // if extname is empty, add it to the name
    let modifiedNewName = newName.trim().replace(/\s/g, '_');

    if (element.type === 'folder') {
      await renameFolder(element.key, modifiedNewName)
        .then(() => {
          queryClient.invalidateQueries(
            readFolderQueryOption(element.parentKey)
          );
          renameElement(element.key, modifiedNewName);
          toggleRenameModalOpen();
        })
        .finally(() => {
          unselectAll();
        });
      return;
    } else if (element.type === 'file') {
      const newExtName = modifiedNewName.match(/\.[0-9a-z]+$/i)?.[0] || '';
      const extname = element.name.match(/\.[0-9a-z]+$/i)?.[0] || '';

      if (newExtName === '') {
        modifiedNewName = `${modifiedNewName}${extname}`;
      }
      if (element.name === modifiedNewName) {
        toggleRenameModalOpen();
        unselectAll();
        return;
      }
      await renameFile(element.key, modifiedNewName)
        .then(() => {
          queryClient.invalidateQueries(
            readFolderQueryOption(element.parentKey)
          );
          renameElement(element.key, modifiedNewName);
          toggleRenameModalOpen();
        })
        .finally(() => {
          unselectAll();
        });
    }
  };

  const handleDownload = async () => {
    if (selectedElements.length === 0) {
      return;
    }
    const selectedFiles = selectedElements.filter(
      (element) => element.type === 'file'
    );
    toggleDownloadModalOpen();
    unselectAll();
    selectedFiles.forEach(async (file) => {
      await downloadFile(file.key, file.name).then(
        (response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.name);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      );
    });
  };

  useEffect(() => {
    setSelectedElements(elements.filter((element) => element.selected));
  }, [elements]);

  useEffect(() => {
    setIsFolderSelected(
      elements.some((element) => element.selected && element.type === 'folder')
    );
  }, [elements]);

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
      {selectedElements.length === 1 && (
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
          <input type="text" onChange={(e) => setNewName(e.target.value)} />
        </Modal>
      )}
      {deleteModalOpen && (
        <Modal onAccept={handleDelete} onClose={toggleDeleteModalOpen}>
          <div>
            Are you sure you want to delete {selectedElements.length}{' '}
            {selectedElements.length === 1 ? 'item' : 'items'}?
          </div>
        </Modal>
      )}
      {moveMenuOpen && <MoveMenu folderKey={folderKey} toggle={toggleMoving} />}
      {downloadModalOpen && (
        <Modal onAccept={handleDownload} onClose={toggleDownloadModalOpen}>
          <div>
            Are you sure you want to download {selectedElements.length}{' '}
            {selectedElements.length === 1 ? 'item' : 'items'}?
          </div>
        </Modal>
      )}
    </div>
  );
};
