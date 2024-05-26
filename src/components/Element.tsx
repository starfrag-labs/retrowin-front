import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { StoreElement, useElementStore } from '../store/elementStore';
import { useTokenStore } from '../store/tokenStore';
import {
  deleteFile,
  deleteFolder,
  downloadFile,
  renameFile,
  renameFolder,
} from '../utils/api/cloud';
import { getContentType } from '../utils/contentTypeGetter';

export const Element = ({ element }: { element: StoreElement }) => {
  const accessToken = useTokenStore.getState().accessToken;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(element.name);
  const elementStore = useElementStore();
  const contentType = getContentType(element.name);

  const deleteElementHandler = async () => {
    elementStore.removeElement(element.key);
    if (element.type === 'folder') {
      deleteFolder(accessToken, element.key).then(() => {
        queryClient.invalidateQueries({
          queryKey: ['read', 'folder', element.key],
        });
        elementStore.removeElement(element.key);
      });
    } else if (element.type === 'file') {
      deleteFile(accessToken, element.parentKey, element.key).then(() => {
        queryClient.invalidateQueries({
          queryKey: ['read', 'folder', element.parentKey],
        });
        elementStore.removeElement(element.key);
      });
    }
  };

  const renameHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newName = new FormData(event.currentTarget).get('newName') as string;
    const tempName = element.name;
    setName(newName);
    setIsEditing(false);
    if (element.type === 'folder') {
      renameFolder(accessToken, element.key, newName)
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ['read', 'folder', element.key],
          });
          elementStore.renameElement(element.key, newName);
        })
        .catch(() => {
          elementStore.renameElement(element.key, tempName);
          setName(tempName);
        });
    } else if (element.type === 'file') {
      renameFile(accessToken, element.parentKey, element.key, newName)
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ['read', 'folder', element.parentKey],
          });
          elementStore.renameElement(element.key, newName);
        })
        .catch(() => {
          elementStore.renameElement(element.key, tempName);
          setName(tempName);
        });
    }
  };

  const downloadHandler = async () => {
    const response = await downloadFile(
      accessToken,
      element.parentKey,
      element.key
    ).catch((error) => {
      console.error(error);
    });
    if (!response) {
      return;
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', element.name);
    link.style.cssText = 'display:none';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const openImageHandler = async () => {
    if (!contentType) {
      return;
    }
    const response = await downloadFile(
      accessToken,
      element.parentKey,
      element.key
    ).catch((error) => {
      console.error(error);
    });
    if (!response) {
      return;
    }
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: contentType })
    );
    window.open(url);
  };

  return (
    <div>
      <div>
        {element.type === 'folder' ? (
          <button onClick={deleteElementHandler}>delete folder</button>
        ) : (
          <button onClick={deleteElementHandler}>delete file</button>
        )}
      </div>
      <div>
        {element.type === 'file' ? (
          <button onClick={downloadHandler}>download file</button>
        ) : null}
      </div>
      <div>
        {element.type === 'file' && contentType ? (
          <button onClick={openImageHandler}>open image</button>
        ) : null}
      </div>
      <form onSubmit={renameHandler}>
        {isEditing ? (
          <input name="newName" defaultValue={name} />
        ) : (
          <div onDoubleClick={() => setIsEditing(!isEditing)}>{name}</div>
        )}
      </form>
    </div>
  );
};
