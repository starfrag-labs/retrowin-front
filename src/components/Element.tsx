import { useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { downloadFile, renameFile, renameFolder } from '../api/cloud';
import { getContentType } from '../utils/customFn/contentTypeGetter';
import { FaFileMedical, FaFolder } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import {
  uploadFileIcon,
  folderIcon,
  fileIcon,
  elementNameContainer,
  elementNameTextarea,
  backgroundElementNameText,
  windowElement,
  backgroundElement,
  backgroundSelectedElement,
  windowSelectedElement,
  windowElementNameText,
} from '../styles/element.css';
import { IElementState } from '../types/store';
import { useRefStore } from '../store/ref.store';
import { useEventStore } from '../store/event.store';
import { useWindowStore } from '../store/window.store';
import { useElementStore } from '../store/element.store';

export const Element = memo(
  ({
    name,
    elementKey,
    parentKey,
    type,
    selected,
    renaming,
    isWindowElement,
  }: {
    name: string;
    elementKey: string;
    parentKey: string;
    type: IElementState['type'];
    selected: boolean;
    renaming: boolean;
    isWindowElement: boolean;
  }): React.ReactElement => {
    const queryClient = useQueryClient();

    // states
    const [nameState, setNameState] = useState(name);
    const [newNameState, setNewNameState] = useState(name);

    // refs
    const elementRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const renameRef = useRef<HTMLTextAreaElement>(null);

    // store functions
    const newWindow = useWindowStore((state) => state.newWindow);
    const findWindowByTarget = useWindowStore(
      (state) => state.findWindowByTarget
    );
    const updateWindow = useWindowStore((state) => state.updateWindow);
    const setElementRef = useRefStore((state) => state.setElementRef);
    const setRenaming = useEventStore((state) => state.setRenaming);
    const setRenamingKey = useElementStore((state) => state.setRenamingKey);
    const setElementInfo = useElementStore((state) => state.setElementInfo);

    const contentType = getContentType(name);

    useEffect(() => {
      if (elementRef.current) {
        setElementRef(elementKey, elementRef);
      }
    }, [elementKey, setElementRef]);

    useEffect(() => {
      setElementInfo(elementKey, {
        key: elementKey,
        name,
        type,
        parentKey,
      });
    }, [elementKey, name, parentKey, setElementInfo, type]);

    // click icon event handler
    const handleClickIcon = () => {
      if (type === 'file' && contentType) {
        if (contentType.startsWith('image')) {
          newWindow(elementKey, 'image');
        } else if (contentType.includes('video')) {
          newWindow(elementKey, 'video');
        }
      } else if (type === 'file') {
        handleDownload();
      } else if (type === 'folder') {
        const window = findWindowByTarget(parentKey);
        if (window) {
          updateWindow(window.key, elementKey);
        } else {
          newWindow(elementKey, 'navigator');
        }
      }
    };

    // download file event handler
    const handleDownload = async () => {
      const response = await downloadFile(elementKey, name);
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

    const handleTextareaChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const textarea = event.currentTarget;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      setNewNameState(textarea.value.replace(/\s/g, '_'));
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && event.shiftKey === false) {
        event.preventDefault();
        event.currentTarget.closest('form')?.submit();
      }
    };

    useEffect(() => {
      if (renaming && renameRef.current) {
        renameRef.current.style.height = 'auto';
        renameRef.current.style.height = `${renameRef.current.scrollHeight}px`;
        renameRef.current.focus();
        renameRef.current.value = '';
        renameRef.current.value = nameState;
        setRenaming(true);
      } else {
        setRenaming(false);
      }
    }, [nameState, renaming, setRenaming]);

    const highlightElement = useCallback(async () => {
      if (elementRef.current && nameRef.current && selected) {
        elementRef.current.className = isWindowElement
          ? windowSelectedElement
          : backgroundSelectedElement;
        nameRef.current.style.whiteSpace = 'wrap';
      } else if (elementRef.current && nameRef.current) {
        elementRef.current.className = isWindowElement
          ? windowElement
          : backgroundElement;
        nameRef.current.style.whiteSpace = 'nowrap';
      }
    }, [isWindowElement, selected]);

    useEffect(() => {
      highlightElement();
    }, [highlightElement]);

    const renameElement = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setRenamingKey(null);
        } else if (
          event.key === 'Enter' &&
          newNameState !== name &&
          type === 'folder'
        ) {
          event.preventDefault();
          const tempName = name;
          setNameState(newNameState);
          renameFolder(elementKey, newNameState)
            .then(() => {
              queryClient.invalidateQueries({
                queryKey: ['folder', parentKey],
              });
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
          renameFile(elementKey, newNameState)
            .then(() => {
              queryClient.invalidateQueries({
                queryKey: ['folder', parentKey],
              });
            })
            .catch(() => {
              setNameState(tempName);
            });
        } else if (event.key === 'Enter' && newNameState === name) {
          setRenamingKey(null);
        }
      },
      [
        elementKey,
        name,
        newNameState,
        parentKey,
        queryClient,
        setRenamingKey,
        type,
      ]
    );

    useEffect(() => {
      document.addEventListener('keydown', renameElement);
      return () => {
        document.removeEventListener('keydown', renameElement);
      };
    }, [renameElement]);

    const handleEndRenaming = useCallback(
      (e: MouseEvent) => {
        if (e.button === 0 && renaming && e.target !== renameRef.current) {
          setRenamingKey(null);
        }
      },
      [renaming, setRenamingKey]
    );

    useEffect(() => {
      document.addEventListener('mousedown', handleEndRenaming);
      return () => {
        document.removeEventListener('mousedown', handleEndRenaming);
      };
    }, [handleEndRenaming]);

    return (
      <div
        className={isWindowElement ? windowElement : backgroundElement}
        onDoubleClick={handleClickIcon}
        ref={elementRef}
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
              onFocus={(e) => e.currentTarget.select()}
            />
          ) : (
            <div
              className={
                isWindowElement
                  ? windowElementNameText
                  : backgroundElementNameText
              }
              ref={nameRef}
            >
              {nameState}
            </div>
          )}
        </div>
      </div>
    );
  }
);
