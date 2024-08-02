import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import {
  menu,
  menuContainer,
  uploadForm,
  menuLabel,
} from '../../../styles/mobile/menu.css';
import { generateQueryKey } from '../../../utils/queryOptions/index.query';
import { uploadFileMutationOption } from '../../../utils/queryOptions/file.query';
import { createFolderMutationOption } from '../../../utils/queryOptions/folder.query';

export const Uploader = ({
  folderKey,
  toggle,
}: {
  folderKey: string;
  toggle: () => void;
}) => {
  const queryClient = useQueryClient();

  const uploadFile = useMutation(uploadFileMutationOption);
  const createFolder = useMutation(createFolderMutationOption)

  // refs
  const menuRef = useRef<HTMLDivElement>(null);
  const uploadFileFormRef = useRef<HTMLFormElement>(null);
  const uploadFileButtonRef = useRef<HTMLButtonElement>(null);

  const uploadFileHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const files = Array.from(event.currentTarget.file.files) as File[];
    files.forEach((file) => {
      uploadFile.mutateAsync({file, folderKey}).then(() => {
        queryClient.invalidateQueries({
          queryKey: generateQueryKey('folder', folderKey),
        });
      });
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
    createFolder.mutateAsync({parentKey: folderKey, folderName: 'NewFolder'}).then(() => {
      queryClient.invalidateQueries({
        queryKey: generateQueryKey('folder', folderKey),
      });
    });
    toggle();
  }, [createFolder, folderKey, queryClient, toggle]);

  return (
    <div className={menuContainer} onTouchEnd={handleCloseMenu}>
      <div className={menu} ref={menuRef}>
        <form
          onSubmit={uploadFileHandler}
          ref={uploadFileFormRef}
          className={uploadForm}
        >
          <label htmlFor="file" className={menuLabel}>
            Upload Files
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
          <button type="submit" hidden ref={uploadFileButtonRef} />
        </form>
        <div onTouchEnd={handleCreateFolder} className={menuLabel}>
          Create Folder
        </div>
      </div>
    </div>
  );
};
