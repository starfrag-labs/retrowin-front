import { useQueryClient } from '@tanstack/react-query';
import { useProgressStore } from '../../../store/progress.store';
import { createFolder, uploadChunk } from '../../../api/cloud';
import { useCallback, useRef } from 'react';
import {
  menu,
  menuContainer,
  uploadForm,
  menuLabel,
} from '../../../styles/mobile/menu.css';

export const Uploader = ({
  folderKey,
  toggle,
}: {
  folderKey: string;
  toggle: () => void;
}) => {
  const chunkSize = 1024 * 1024 * 5;
  const queryClient = useQueryClient();

  // refs
  const menuRef = useRef<HTMLDivElement>(null);
  const uploadFileFormRef = useRef<HTMLFormElement>(null);
  const uploadFileButtonRef = useRef<HTMLButtonElement>(null);

  const uploadFile = async (file: File) => {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileName = file.name.replace(/\s/g, '_');

    // check if progress exists
    if (useProgressStore.getState().findProgress(`${folderKey}-${fileName}`)) {
      return;
    }

    // add progress
    useProgressStore.getState().addProgress({
      key: `${folderKey}-${fileName}`,
      name: `${fileName}`,
      type: 'upload',
    });

    // upload chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, (i + 1) * chunkSize);
      const chunk = file.slice(start, end);
      await uploadChunk(folderKey, chunk, fileName, totalChunks, i);
    }
    useProgressStore.getState().removeProgress(`${folderKey}-${fileName}`);
    queryClient.invalidateQueries({
      queryKey: ['read', 'folder', folderKey],
    });
  };

  const uploadFileHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const files = Array.from(event.currentTarget.file.files) as File[];
    files.forEach((file) => {
      uploadFile(file);
    });
    toggle();
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

  const handleCreateFolder = useCallback(() => {
    createFolder(folderKey, 'NewFolder').then(() => {
      queryClient.invalidateQueries({
        queryKey: ['read', 'folder', folderKey],
      });
    });
    toggle();
  }, [folderKey, queryClient, toggle]);

  return (
    <div className={menuContainer} onTouchEnd={handleCloseMenu}>
      <div className={menu} ref={menuRef}>
        <form
          onSubmit={uploadFileHandler}
          ref={uploadFileFormRef}
          className={uploadForm}
        >
          <label htmlFor="file" className={menuLabel}>
            upload files
          </label>
          <input
            type="file"
            id="file"
            multiple
            onChange={(e) => {
              e.preventDefault();
              if (!uploadFileButtonRef.current) return;
              uploadFileButtonRef.current.click();
            }}
            style={{ display: 'none' }}
          />
          <button type="submit" hidden ref={uploadFileButtonRef}>
            upload
          </button>
        </form>
        <div onTouchEnd={handleCreateFolder} className={menuLabel}>
          create folder
        </div>
      </div>
    </div>
  );
};
