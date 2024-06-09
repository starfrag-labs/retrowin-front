import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTokenStore } from '../store/token.store';
import { downloadFile, renameFile, renameFolder } from '../utils/api/cloud';
import { getContentType } from '../utils/customFn/contentTypeGetter';
import { FaFileMedical, FaFolder } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import {
  fileIcon,
  folderIcon,
  elementContainer,
  elementNameText,
  elementNameContainer,
  elementNameTextarea,
  uploadFileIcon,
} from '../css/styles/element.css';
import { useElementStore } from '../store/element.store';
import { IStoreElement } from '../types/element';

export const Element = ({
  element,
  uploadFileHandler,
}: {
  element: IStoreElement;
  uploadFileHandler?: () => void;
}): React.ReactElement => {
  console.log('Element called');

  const queryClient = useQueryClient();

  const accessToken = useTokenStore((state) => state.accessToken);
  const unselectElement = useElementStore((state) => state.unselectElement);
  const selectElement = useElementStore((state) => state.selectElement);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(element.name);
  const [newName, setNewName] = useState(element.name);

  const contentType = getContentType(element.name);
  const elementRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const renameRef = useRef<HTMLTextAreaElement>(null);

  const handleClickIcon = () => {
    if (element.type === 'file' && contentType) {
      openImage();
    } else if (element.type === 'file') {
      handleDownload();
    }
  };

  const handleDownload = async () => {
    const response = await downloadFile(
      accessToken,
      element.parentKey,
      element.key
    );
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

  const openImage = async () => {
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

  const handleClickName = () => {
    if (
      element.selected &&
      (element.type === 'folder' || element.type === 'file')
    ) {
      setIsEditing(true);
    }
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setNewName(textarea.value);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      event.currentTarget.closest('form')?.submit();
    }
  };

  const handleElementHighlight = async () => {
    if (elementRef.current && nameRef.current && !element.selected) {
      selectElement(element.key);
    }
  };

  const handleMouseOn = () => {
    if (elementRef.current && nameRef.current && !element.selected) {
      const backgroundColor = 'rgba(255, 255, 255, 0.1)';
      elementRef.current.style.backgroundColor = backgroundColor;
    }
  };

  const handleMouseOut = () => {
    if (elementRef.current && nameRef.current && !element.selected) {
      const backgroundColor = 'rgba(0, 0, 0, 0)';
      elementRef.current.style.backgroundColor = backgroundColor;
    }
  };

  useEffect(() => {
    if (isEditing && renameRef.current) {
      renameRef.current.style.height = 'auto';
      renameRef.current.style.height = `${renameRef.current.scrollHeight}px`;
      renameRef.current.focus();
      renameRef.current.value = '';
      renameRef.current.value = name;
    }
  }, [isEditing, name]);

  const highlightElement = useCallback(async () => {
    if (elementRef.current && nameRef.current && element.selected) {
      const backgroundColor = 'rgba(255, 255, 255, 0.2)';
      elementRef.current.style.backgroundColor = backgroundColor;
      nameRef.current.style.whiteSpace = 'wrap';
    } else if (elementRef.current && nameRef.current) {
      const backgroundColor = 'rgba(0, 0, 0, 0)';
      elementRef.current.style.backgroundColor = backgroundColor;
      nameRef.current.style.whiteSpace = 'nowrap';
    }
  }, [element.selected]);

  useEffect(() => {
    highlightElement();
  }, [highlightElement]);

  const renameElement = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      } else if (
        event.key === 'Enter' &&
        newName !== element.name &&
        element.type === 'folder'
      ) {
        event.preventDefault();
        const tempName = element.name;
        setName(newName);
        setIsEditing(false);
        renameFolder(accessToken, element.key, newName)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ['read', 'folder', element.parentKey],
            });
          })
          .catch(() => {
            setName(tempName);
          });
      } else if (
        event.key === 'Enter' &&
        newName !== element.name &&
        element.type === 'file'
      ) {
        event.preventDefault();
        const tempName = element.name;
        setName(newName);
        setIsEditing(false);
        renameFile(accessToken, element.parentKey, element.key, newName)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ['read', 'folder', element.parentKey],
            });
          })
          .catch(() => {
            setName(tempName);
          });
      }
    },
    [accessToken, element, newName, queryClient]
  );

  useEffect(() => {
    document.addEventListener('keydown', renameElement);
    return () => {
      document.removeEventListener('keydown', renameElement);
    };
  }, [renameElement]);

  const handleRenameClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        renameRef.current &&
        !renameRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    },
    [renameRef]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleRenameClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleRenameClickOutside);
    };
  }, [handleRenameClickOutside]);

  const handleElementClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        unselectElement(element.key);
      }
    },
    [element.key, elementRef, unselectElement]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleElementClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleElementClickOutside);
    };
  }, [handleElementClickOutside]);

  return (
    <div
      className={elementContainer}
      onDoubleClick={handleClickIcon}
      onClick={handleElementHighlight}
      ref={elementRef}
      onMouseOver={handleMouseOn}
      onMouseOut={handleMouseOut}
      id={element.key}
    >
      {element.type === 'upload' && (
        <FaFileMedical
          onDoubleClick={uploadFileHandler}
          className={uploadFileIcon}
        />
      )}
      {element.type === 'folder' && <FaFolder className={folderIcon} />}
      {element.type === 'file' && <FaFileAlt className={fileIcon} />}
      <div className={elementNameContainer}>
        {isEditing ? (
          <textarea
            id="rename"
            defaultValue={name}
            ref={renameRef}
            className={elementNameTextarea}
            onChange={handleTextareaChange}
            onKeyDown={handleEnter}
            spellCheck="false"
          />
        ) : (
          <div
            onClick={handleClickName}
            className={elementNameText}
            ref={nameRef}
          >
            {name}
          </div>
        )}
      </div>
    </div>
  );
};
