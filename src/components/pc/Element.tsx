import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { FaFileMedical, FaFolder } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import { IElementState } from '../../types/store';
import { useEventStore } from '../../store/event.store';
import { useWindowStore } from '../../store/window.store';
import { useElementStore } from '../../store/element.store';
import { generateQueryKey } from '../../utils/queryOptions/index.query';
import { useSelectorStore } from '../../store/selector.store';
import {
  downloadFileQueryOption,
  renameFileMutationOption,
} from '../../utils/queryOptions/file.query';
import { renameFolderMutationOption } from '../../utils/queryOptions/folder.query';
import {
  windowSelectedElement,
  backgroundSelectedElement,
  windowElement,
  backgroundElement,
  uploadFileIcon,
  folderIcon,
  fileIcon,
  elementNameContainer,
  elementNameTextarea,
  windowElementNameText,
  backgroundElementNameText,
} from '../../styles/pc/element.css';

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

    // Mutations
    const renameFile = useMutation(renameFileMutationOption);
    const renameFolder = useMutation(renameFolderMutationOption);

    // states
    const [nameState, setNameState] = useState(name);
    const [newNameState, setNewNameState] = useState(name);

    // refs
    const elementRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const renameRef = useRef<HTMLTextAreaElement>(null);

    // store states
    const rect = useSelectorStore((state) => state.rect);
    const pressedKeys = useEventStore((state) => state.pressedKeys);

    // store functions
    const newWindow = useWindowStore((state) => state.newWindow);
    const updateWindow = useWindowStore((state) => state.updateWindow);
    const findWindowByTarget = useWindowStore(
      (state) => state.findWindowByTarget
    );
    const setRenaming = useEventStore((state) => state.setRenaming);
    const setRenamingKey = useElementStore((state) => state.setRenamingKey);
    const setElementInfo = useElementStore((state) => state.setElementInfo);
    const setElementRef = useElementStore((state) => state.setElementRef);
    const setCurrentElement = useElementStore(
      (state) => state.setCurrentElement
    );
    const selectKey = useElementStore((state) => state.selectKey);
    const unselectKey = useElementStore((state) => state.unselectKey);

    const contentType = getContentType(name);

    // check element in rect
    const checkElementInRect = useCallback(() => {
      if (elementRef.current && rect) {
        const elementRect = elementRef.current.getBoundingClientRect();
        if (
          (type === 'folder' || type === 'file') &&
          elementRect.top < rect.bottom &&
          elementRect.bottom > rect.top &&
          elementRect.left < rect.right &&
          elementRect.right > rect.left
        ) {
          selectKey(elementKey);
        } else if (!pressedKeys.includes('Control') && selected) {
          unselectKey(elementKey);
        }
      }
    }, [elementKey, pressedKeys, rect, selectKey, selected, type, unselectKey]);

    // update selected element
    useEffect(() => {
      checkElementInRect();
    }, [checkElementInRect]);

    useEffect(() => {
      if (elementRef.current) {
        setElementRef(elementKey, iconRef);
      }
    }, [elementKey, setElementRef]);

    // set element info
    useEffect(() => {
      setElementInfo({
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
    const handleDownload = useCallback(async () => {
      queryClient
        .ensureQueryData(downloadFileQueryOption(elementKey, name))
        .then((response) => {
          const url = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', name);
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    }, [elementKey, name, queryClient]);

    // rename element event handler
    const handleTextareaChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = event.currentTarget;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        setNewNameState(textarea.value.replace(/\s/g, '_'));
      },
      []
    );

    // handle enter key event for renaming
    const handleEnter = useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && event.shiftKey === false) {
          event.preventDefault();
          event.currentTarget.closest('form')?.submit();
        }
      },
      []
    );

    // start renaming effect
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

    // highlight element effect
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

    // rename element effect
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
          renameFolder
            .mutateAsync({
              folderKey: elementKey,
              folderName: newNameState,
            })
            .then(() => {
              queryClient.invalidateQueries({
                queryKey: generateQueryKey('folder', parentKey),
              });
              queryClient.invalidateQueries({
                queryKey: generateQueryKey('user', 'favorite'),
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
          renameFile
            .mutateAsync({
              fileKey: elementKey,
              fileName: newNameState,
            })
            .then(() => {
              queryClient.invalidateQueries({
                queryKey: generateQueryKey('folder', parentKey),
              });
              queryClient.invalidateQueries({
                queryKey: generateQueryKey('user', 'favorite'),
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
        renameFile,
        renameFolder,
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

    // set current element effect
    const onMouseEnter = useCallback(() => {
      if (type === 'file' || type === 'folder') {
        setCurrentElement({ key: elementKey, ref: elementRef });
      }
    }, [elementKey, setCurrentElement, type]);

    // reset current element effect
    const onMouseLeave = useCallback(() => {
      setCurrentElement(null);
    }, [setCurrentElement]);

    return (
      <div
        className={isWindowElement ? windowElement : backgroundElement}
        onDoubleClick={handleClickIcon}
        onTouchEnd={handleClickIcon}
        ref={elementRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div ref={iconRef}>
          {type === 'upload' && <FaFileMedical className={uploadFileIcon} />}
          {type === 'folder' && <FaFolder className={folderIcon} />}
          {type === 'file' && <FaFileAlt className={fileIcon} />}
        </div>
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
