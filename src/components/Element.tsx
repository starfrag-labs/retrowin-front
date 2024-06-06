import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
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
import { FaFolder } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { FiDownload } from "react-icons/fi";
import {
  IconContainer,
  fileIcon,
  folderIcon,
  deleteIcon,
  elementContainer,
  downloadIcon,
} from '../css/styles/element.css';
import { columnButtonContainer } from '../css/styles/container.css';
import { redirect } from '@tanstack/react-router';

export const Element = ({
  element,
  deleting,
}: {
  element: StoreElement;
  deleting: boolean;
}) => {
  const accessToken = useTokenStore.getState().accessToken;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(element.name);
  const elementStore = useElementStore();
  const contentType = getContentType(element.name);
  const renameRef = useRef<HTMLInputElement>(null);

  const deleteHandler = async () => {
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

  const clickIconHandler = () => {
    if (element.type === 'folder') {
      throw redirect({
        to: `/cloud/$folderKey`,
        params: {
          folderKey: element.key,
        },
      });
    } else if (element.type === 'file' && contentType) {
        openImageHandler();
    } else if (element.type === 'file') {
        downloadHandler();
    } else {
      throw new Error('Element type is not supported');
    }
  };

  const renameHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newName = new FormData(event.currentTarget)
      .get('newName')
      ?.toString()
      .replace(' ', '-');
    if (!newName) {
      return;
    }
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        renameRef.current &&
        !renameRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [renameRef]);

  return (
    <div className={elementContainer} onDoubleClick={clickIconHandler}>
      {deleting ? (
        <TiDelete onClick={deleteHandler} className={deleteIcon} />
      ) : (
        <FiDownload onClick={downloadHandler} className={downloadIcon} />
      )}
      {element.type === 'folder' ? (
        <div className={IconContainer}>
          <FaFolder className={folderIcon} />
        </div>
      ) : (
        <div className={IconContainer}>
          <FaFileAlt className={fileIcon} />
        </div>
      )}
      <div className={columnButtonContainer}>
        {element.type === 'file' ? (
          <button onClick={downloadHandler}>download file</button>
        ) : null}
        {element.type === 'file' && contentType ? (
          <button onClick={openImageHandler}>open image</button>
        ) : null}
      </div>
      <form onSubmit={renameHandler}>
        {isEditing ? (
          <input name="newName" defaultValue={name} ref={renameRef} />
        ) : (
          <div onDoubleClick={() => setIsEditing(!isEditing)}>{name}</div>
        )}
      </form>
    </div>
  );
};
