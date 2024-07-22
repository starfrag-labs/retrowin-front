import { useCallback, useEffect, useRef, useState } from 'react';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';
import { draggingElementsIcon } from '../styles/element.css';
import { moveFile, moveFolder } from '../api/cloud';
import { useQueryClient } from '@tanstack/react-query';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { defaultContainer } from '../styles/global/container.css';
import { IElementState } from '../types/store';
import { useEventStore } from '../store/event.store';
import { useWindowStore } from '../store/window.store';

export const Dragger = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // States
  const [shiftKey, setShiftKey] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingReady, setIsDraggingReady] = useState(false);
  const [displayDraggingElements, setDisplayDraggingElements] = useState(false);
  const [pointerMoved, setPointerMoved] = useState(false); // To prevent the click event from being triggered when dragging

  // Refs
  const draggingElementsRef = useRef<HTMLDivElement>(null);

  // Store states
  const elements = useElementStore((state) => state.elements);
  const elementsRef = useRefStore((state) => state.elementsRef);
  const windowsRef = useRefStore((state) => state.windowsRef);
  const backgroundWindowRef = useRefStore((state) => state.backgroundWindowRef);
  const rootKey = useElementStore((state) => state.rootKey);
  const menuRef = useRefStore((state) => state.menuRef);
  const resizing = useEventStore((state) => state.resizing);
  const renaming = useEventStore((state) => state.renaming);

  // Store functions
  const findElement = useElementStore((state) => state.findElement);
  const moveElement = useElementStore((state) => state.moveElement);
  const selectElement = useElementStore((state) => state.selectElement);
  const unselectAllElements = useElementStore(
    (state) => state.unselectAllElements
  );
  const findWindow = useWindowStore((state) => state.findWindow);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKey(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKey(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const dragElementInit = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (resizing || renaming) return;

      // Check if the mouse event is triggered on the menu
      const currentMenuRef = menuRef?.current;
      if (currentMenuRef && currentMenuRef.contains(e.target as Node)) return;

      // Check if the mouse event is triggered on an element
      let element: IElementState | undefined;
      elementsRef.forEach((elementRef, key) => {
        if (elementRef.current?.contains(e.target as Node)) {
          element = findElement(key);
        }
      });
      // If the mouse event is not triggered on an element, return
      if (!element) return;
      if (!shiftKey && !element.selected) {
        unselectAllElements();
      }
      selectElement(element.key);
      setPointerMoved(false); // Reset the pointerMoved state
      setIsDraggingReady(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
    },
    [
      elementsRef,
      findElement,
      menuRef,
      renaming,
      resizing,
      selectElement,
      shiftKey,
      unselectAllElements,
    ]
  );

  const dragElementStart = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (
        isDraggingReady &&
        !isDragging &&
        Math.abs(e.pageX - startX) > 5 &&
        Math.abs(e.pageY - startY) > 5
      ) {
        document.body.style.cursor = 'grabbing';
        setDisplayDraggingElements(true);
        setPointerMoved(true);
        setIsDragging(true);
        elementsRef.forEach((elementRef, key) => {
          const element = findElement(key);
          let contained = false;
          if (elementRef.current?.contains(e.target as Node)) {
            contained = true;
          }
          if (!element?.selected && !contained) return;
          const clone = elementRef.current?.cloneNode(true) as HTMLDivElement;
          clone.style.position = 'absolute';
          clone.style.left =
            elementRef.current?.getBoundingClientRect().left + 'px';
          clone.style.top =
            elementRef.current?.getBoundingClientRect().top + 'px';
          draggingElementsRef.current?.appendChild(clone);
        });
      }
    },
    [elementsRef, findElement, isDragging, isDraggingReady, startX, startY]
  );

  const dragElement = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      if (!draggingElementsRef.current) return;
      e.preventDefault();
      draggingElementsRef.current.style.left = e.pageX - startX + 'px';
      draggingElementsRef.current.style.top = e.pageY - startY + 'px';
    },
    [isDragging, startX, startY]
  );

  const dragElementEnd = useCallback(
    (e: MouseEvent) => {
      setIsDragging(false);
      setIsDraggingReady(false);
      setDisplayDraggingElements(false);
      if (!isDragging) return;
      if (!draggingElementsRef.current) return;
      e.preventDefault();
      draggingElementsRef.current.innerHTML = '';
      document.body.style.cursor = 'default';
      let targetFolderKey: string = '';

      // Search for the target folder from the background
      if (
        backgroundWindowRef?.current &&
        backgroundWindowRef.current.contains(e.target as Node)
      ) {
        targetFolderKey = rootKey;
      }

      // Search for the target folder from the windows
      windowsRef.forEach((windowRef, key) => {
        const window = findWindow(key);
        if (
          window &&
          windowRef.current?.contains(e.target as Node) &&
          findElement(window.targetKey)?.type === 'folder'
        ) {
          targetFolderKey = window.targetKey;
        }
      });

      // Search for the target folder from the elements
      elementsRef.forEach((elementRef, key) => {
        if (
          elementRef.current?.contains(e.target as Node) &&
          findElement(key)?.type === 'folder'
        ) {
          targetFolderKey = key;
        }
      });

      // Move the selected elements to the target folder
      if (targetFolderKey && pointerMoved) {
        elements.forEach((element) => {
          if (element.key === targetFolderKey) return;
          if (element.parentKey === targetFolderKey) return;
          if (element.selected && element.type === 'folder') {
            moveFolder(element.key, targetFolderKey).then(() => {
              queryClient.invalidateQueries(
                readFolderQueryOption(targetFolderKey)
              );
              queryClient.invalidateQueries(
                readFolderQueryOption(element.parentKey)
              );
              moveElement(element.key, targetFolderKey);
            });
          } else if (element.selected && element.type === 'file') {
            moveFile(element.key, targetFolderKey).then(
              () => {
                queryClient.invalidateQueries(
                  readFolderQueryOption(targetFolderKey)
                );
                queryClient.invalidateQueries(
                  readFolderQueryOption(element.parentKey)
                );
                moveElement(element.key, targetFolderKey);
              }
            );
          }
        });
      }
    },
    [
      isDragging,
      backgroundWindowRef,
      windowsRef,
      elementsRef,
      pointerMoved,
      rootKey,
      findWindow,
      findElement,
      elements,
      queryClient,
      moveElement,
    ]
  );

  useEffect(() => {
    document.addEventListener('mousedown', dragElementInit);
    return () => {
      document.removeEventListener('mousedown', dragElementInit);
    };
  }, [dragElementInit]);

  useEffect(() => {
    document.addEventListener('mousemove', dragElementStart);
    return () => {
      document.removeEventListener('mousemove', dragElementStart);
    };
  }, [dragElementStart]);

  useEffect(() => {
    document.addEventListener('mousemove', dragElement);
    return () => {
      document.removeEventListener('mousemove', dragElement);
    };
  }, [dragElement]);

  useEffect(() => {
    document.addEventListener('mouseup', dragElementEnd);
    return () => {
      document.removeEventListener('mouseup', dragElementEnd);
    };
  }, [dragElementEnd]);

  return (
    <div className={defaultContainer}>
      <div
        className={draggingElementsIcon}
        ref={draggingElementsRef}
        hidden={!displayDraggingElements}
      />
      {children}
    </div>
  );
};
