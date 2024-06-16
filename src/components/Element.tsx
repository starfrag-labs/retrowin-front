import { useQueryClient } from '@tanstack/react-query';
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTokenStore } from '../store/token.store';
import { downloadFile, renameFile, renameFolder } from '../api/cloud';
import { getContentType } from '../utils/customFn/contentTypeGetter';
import { FaFileMedical, FaFolder } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import { useWindowStore } from '../store/window.store';
import { elementContainer, uploadFileIcon, folderIcon, fileIcon, elementNameContainer, elementNameTextarea, elementNameText } from '../styles/element.css';
import { IElementState } from '../types/store';
import { useElementStore } from '../store/element.store';

export const Element = memo(
  ({
    name,
    elementKey,
    parentKey,
    type,
    selected,
    renaming,
  }: {
    name: string;
    elementKey: string;
    parentKey: string;
    type: IElementState['type'];
    selected: boolean;
    renaming: boolean;
  }): React.ReactElement => {
    const queryClient = useQueryClient();

    const accessToken = useTokenStore((state) => state.accessToken);
    const newWindow = useWindowStore((state) => state.newWindow);
    const rename = useElementStore((state) => state.renameElement);
    const endRenaming = useElementStore((state) => state.endRenaming);

    const [nameState, setNameState] = useState(name);
    const [newNameState, setNewNameState] = useState(name);

    const contentType = getContentType(name);
    const elementRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const renameRef = useRef<HTMLTextAreaElement>(null);

    const handleClickIcon = () => {
      if (type === 'file' && contentType) {
        openImage();
      } else if (type === 'file') {
        handleDownload();
      } else if (type === 'folder') {
        openFolder();
      }
    };

    const openFolder = () => {
      newWindow(elementKey, 'navigator');
    };

    const handleDownload = async () => {
      const response = await downloadFile(accessToken, parentKey, elementKey);
      if (!response) {
        return;
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      link.style.cssText = 'display:none';
      document.body.appendChild(link);
      link.click();
      link.remove();
    };

    const openImage = async () => {
      if (!contentType) {
        return;
      }
      const response = await downloadFile(accessToken, parentKey, elementKey);
      if (!response) {
        return;
      }
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );
      window.open(url);
    };

    const handleTextareaChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const textarea = event.currentTarget;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      setNewNameState(textarea.value);
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && event.shiftKey === false) {
        event.preventDefault();
        event.currentTarget.closest('form')?.submit();
      }
    };

    const handleMouseOn = () => {
      if (elementRef.current && nameRef.current && !selected) {
        const backgroundColor = 'rgba(255, 255, 255, 0.1)';
        elementRef.current.style.backgroundColor = backgroundColor;
      }
    };

    const handleMouseOut = () => {
      if (elementRef.current && nameRef.current && !selected) {
        const backgroundColor = 'rgba(0, 0, 0, 0)';
        elementRef.current.style.backgroundColor = backgroundColor;
      }
    };

    useEffect(() => {
      if (renaming && renameRef.current) {
        renameRef.current.style.height = 'auto';
        renameRef.current.style.height = `${renameRef.current.scrollHeight}px`;
        renameRef.current.focus();
        renameRef.current.value = '';
        renameRef.current.value = nameState;
      }
    }, [nameState, renaming]);

    const highlightElement = useCallback(async () => {
      if (elementRef.current && nameRef.current && selected) {
        const backgroundColor = 'rgba(255, 255, 255, 0.2)';
        elementRef.current.style.backgroundColor = backgroundColor;
        nameRef.current.style.whiteSpace = 'wrap';
      } else if (elementRef.current && nameRef.current) {
        const backgroundColor = 'rgba(0, 0, 0, 0)';
        elementRef.current.style.backgroundColor = backgroundColor;
        nameRef.current.style.whiteSpace = 'nowrap';
      }
    }, [selected]);

    useEffect(() => {
      highlightElement();
    }, [highlightElement]);

    const renameElement = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          endRenaming(elementKey);
        } else if (
          event.key === 'Enter' &&
          newNameState !== name &&
          type === 'folder'
        ) {
          event.preventDefault();
          const tempName = name;
          setNameState(newNameState);
          endRenaming(elementKey);
          renameFolder(accessToken, elementKey, newNameState)
            .then(() => {
              queryClient.invalidateQueries({
                queryKey: ['read', 'folder', parentKey],
              });
              rename(elementKey, newNameState);
            })
            .catch(() => {
              setNameState(tempName);
            });
        } else if (
          event.key === 'Enter' &&
          newNameState !== name &&
          type === 'file'
        ) {
          event.preventDefault();
          const tempName = name;
          setNameState(newNameState);
          endRenaming(elementKey);
          renameFile(accessToken, parentKey, elementKey, newNameState)
            .then(() => {
              queryClient.invalidateQueries({
                queryKey: ['read', 'folder', parentKey],
              });
            })
            .catch(() => {
              setNameState(tempName);
            });
        } else if (event.key === 'Enter' && newNameState === name) {
          endRenaming(elementKey);
        }
      },
      [
        accessToken,
        elementKey,
        endRenaming,
        name,
        newNameState,
        parentKey,
        queryClient,
        rename,
        type,
      ]
    );

    useEffect(() => {
      document.addEventListener('keydown', renameElement);
      return () => {
        document.removeEventListener('keydown', renameElement);
      };
    }, [renameElement]);

    const handleEndRenaming = useCallback((e: MouseEvent) => {
      if (e.button === 0 && renaming && e.target !== renameRef.current) {
        endRenaming(elementKey);
      }
    }, [elementKey, endRenaming, renaming]);

    useEffect(() => {
      document.addEventListener('mousedown', handleEndRenaming);
      return () => {
        document.removeEventListener('mousedown', handleEndRenaming);
      };
    }, [handleEndRenaming]);

    return (
      <div
        className={elementContainer}
        onDoubleClick={handleClickIcon}
        ref={elementRef}
        onMouseOver={handleMouseOn}
        onMouseOut={handleMouseOut}
      >
        {type === 'upload' && <FaFileMedical className={uploadFileIcon} />}
        {type === 'folder' && <FaFolder className={folderIcon} />}
        {type === 'file' && <FaFileAlt className={fileIcon} />}
        <div className={elementNameContainer}>
          {renaming ? (
            <textarea
              id="rename"
              defaultValue={nameState}
              ref={renameRef}
              className={elementNameTextarea}
              onChange={handleTextareaChange}
              onKeyDown={handleEnter}
              spellCheck="false"
            />
          ) : (
            <div className={elementNameText} ref={nameRef}>
              {nameState}
            </div>
          )}
        </div>
      </div>
    );
  }
);
