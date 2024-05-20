import { useState } from 'react';
import { ReadFolderData } from '../types/response';
import { useQueryClient } from '@tanstack/react-query';
import { renameFile, renameFolder } from '../utils/api/cloud';
import { useTokenStore } from '../store/tokenStore';

function EmptyFolder() {
  return <div>Empty Folder</div>;
}

function Element({
  targetKey,
  initialName,
  rename,
}: {
  targetKey: string;
  initialName: string;
  rename: (key: string, newName: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [isModifying, setIsModifying] = useState(false);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newName = new FormData(event.currentTarget).get('newName') as string;
    setName(newName);
    rename(targetKey, newName);
    setIsModifying(false);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        {isModifying ? (
          <input name="newName" defaultValue={name} />
        ) : (
          <div onClick={() => setIsModifying(!isModifying)}>{name}</div>
        )}
      </form>
    </div>
  );
}

export function FolderReader({
  data,
  folderKey,
}: {
  data: ReadFolderData;
  folderKey: string;
}) {
  const queryClient = useQueryClient();

  const rename =
    (type: 'folder' | 'file') => async (targetKey: string, newName: string) => {
      if (type === 'folder') {
        await renameFolder(
          useTokenStore.getState().accessToken,
          targetKey,
          newName
        ).finally(() => {
          queryClient.invalidateQueries({
            queryKey: ['read', 'folder', folderKey],
            exact: true,
          });
        });
      } else {
        await renameFile(
          useTokenStore.getState().accessToken,
          folderKey,
          targetKey,
          newName
        ).finally(() => {
          queryClient.invalidateQueries({
            queryKey: ['read', 'folder', folderKey],
            exact: true,
          });
        });
      }
    };

  return (
    <div>
      {data.folders.length === 0 && data.files.length === 0 ? (
        <EmptyFolder />
      ) : (
        <div>
          {data.folders.map((folder) => {
            return (
              <Element
                key={folder.folderKey}
                targetKey={folder.folderKey}
                initialName={folder.folderName}
                rename={rename('folder')}
              />
            );
          })}
          {data.files.map((file) => {
            return (
              <Element
                key={file.fileKey}
                targetKey={file.fileKey}
                initialName={file.fileName}
                rename={rename('file')}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
