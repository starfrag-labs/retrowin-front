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
import { CiMenuKebab } from 'react-icons/ci';
import {
  BoxContainer,
  fileIcon,
  folderIcon,
  elementContainer,
  IconContainer,
  menu,
  menuIcon,
} from '../css/styles/element.css';
import { redirect } from '@tanstack/react-router';

export const Element = ({ element }: { element: StoreElement }) => {
  const accessToken = useTokenStore.getState().accessToken;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState(element.name);
  const elementStore = useElementStore();
  const contentType = getContentType(element.name);
  const renameRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    function handleRenameClickOutside(event: MouseEvent) {
      if (
        renameRef.current &&
        !renameRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    }

    function handleMenuClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleRenameClickOutside);
    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleRenameClickOutside);
      document.removeEventListener('mousedown', handleMenuClickOutside);
    }
  }, [renameRef, menuRef]);

  return (
    <div className={elementContainer}>
      {menuOpen && (
        <div className={menu}>
          <button>download</button>
          <button>delete</button>
          <button>rename</button>
        </div>
      )}
      <div className={BoxContainer} onDoubleClick={clickIconHandler}>
        <div className={IconContainer}>
          <div ref={menuRef}>
            <CiMenuKebab
              onClick={() => setMenuOpen(!menuOpen)}
              className={menuIcon}
            />
          </div>
          {element.type === 'folder' ? (
            <FaFolder className={folderIcon} />
          ) : (
            <FaFileAlt className={fileIcon} />
          )}
        </div>
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
