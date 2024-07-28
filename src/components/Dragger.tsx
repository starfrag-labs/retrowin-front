import { useCallback, useEffect, useRef, useState } from 'react';
import { useMenuStore } from '../store/menu.store';
import {
  draggingElementsCount,
  draggingElementsIcon,
} from '../styles/element.css';
import { moveFile, moveFolder } from '../api/cloud';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRootFolderKeyQueryOption } from '../utils/queryOptions/folder.query';
import { defaultContainer } from '../styles/global/container.css';
import { useEventStore } from '../store/event.store';
import { useWindowStore } from '../store/window.store';
import { useElementStore } from '../store/element.store';
import { generateQueryKey } from '../utils/queryOptions/index.query';

export const Dragger = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // States
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingReady, setIsDraggingReady] = useState(false);
  const [displayDraggingElements, setDisplayDraggingElements] = useState(false);
  const [pointerMoved, setPointerMoved] = useState(false); // To prevent the click event from being triggered when dragging

  // Refs
  const draggingElementsRef = useRef<HTMLDivElement>(null);

  // Store states
  const currentWindow = useWindowStore((state) => state.currentWindow);
  const backgroundWindowRef = useWindowStore(
    (state) => state.backgroundWindowRef
  );
  const menuRef = useMenuStore((state) => state.menuRef);
  const resizing = useEventStore((state) => state.resizing);
  const renaming = useEventStore((state) => state.renaming);
  const currentElement = useElementStore((state) => state.currentElement);
  const selectedKeys = useElementStore((state) => state.selectedKeys);
  const elementRefs = useElementStore((state) => state.elementRefs);
  const pressedKeys = useEventStore((state) => state.pressedKeys);

  // Store functions
  const findWindow = useWindowStore((state) => state.findWindow);
  const getElementInfo = useElementStore((state) => state.getElementInfo);
  const isSelected = useElementStore((state) => state.isSelected);
  const selectKey = useElementStore((state) => state.selectKey);
  const unselectAllKeys = useElementStore((state) => state.unselectAllKeys);

  // Query
  const rootKeyQuery = useQuery(getRootFolderKeyQueryOption());

  const dragElementInit = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (resizing || renaming) return;

      // Check if the mouse event is triggered on the menu
      const currentMenuRef = menuRef?.current;
      if (currentMenuRef && currentMenuRef.contains(e.target as Node)) return;

      // Check if the mouse event is triggered on an element
      if (
        currentElement &&
        currentElement.ref.current?.contains(e.target as Node)
      ) {
        if (!isSelected(currentElement.key) && !pressedKeys.includes('Control')) {
          unselectAllKeys();
        }
        selectKey(currentElement.key);
      } else if (!currentElement) {
        // if the mouse event is not triggered on an element
        return;
      }
      setPointerMoved(false); // Reset the pointerMoved state
      setIsDraggingReady(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
    },
    [
      currentElement,
      isSelected,
      menuRef,
      pressedKeys,
      renaming,
      resizing,
      selectKey,
      unselectAllKeys,
    ]
  );

  const dragElementStart = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (
        currentElement?.ref.current &&
        isDraggingReady &&
        !isDragging &&
        Math.abs(e.pageX - startX) > 5 &&
        Math.abs(e.pageY - startY) > 5
      ) {
        document.body.style.cursor = 'grabbing';
        setDisplayDraggingElements(true);
        setPointerMoved(true);
        setIsDragging(true);

        // Create a clone of the selected elements
        let count = 0;
        let width = 0;
        selectedKeys.forEach((key) => {
          if (!isSelected(key) || count > 4) return;
          const elementRef = elementRefs.get(key);
          const elementWidth =
            elementRef?.current?.getBoundingClientRect().width;
          const elementHeight =
            elementRef?.current?.getBoundingClientRect().height;
          if (!elementRef || !elementWidth || !elementHeight) return;
          const clone = elementRef.current?.cloneNode(true) as HTMLDivElement;
          clone.style.position = 'absolute';
          clone.style.left = -elementWidth / 2 + 'px';
          clone.style.top = -elementHeight - count * 5 + 'px';
          clone.style.zIndex = `${-count}`;
          draggingElementsRef.current?.appendChild(clone);

          if (count === 0) {
            width = elementWidth;
          }
          count++;
        });

        // Update the count element
        const countElement = document.createElement('div');
        countElement.innerText = `${count}`;
        countElement.className = draggingElementsCount;
        countElement.style.left = `${width / 2 - 12}px`;
        draggingElementsRef.current?.appendChild(countElement);
      }
    },
    [
      currentElement,
      isDraggingReady,
      isDragging,
      startX,
      startY,
      selectedKeys,
      isSelected,
      elementRefs,
    ]
  );

  const dragElement = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      if (!draggingElementsRef.current) return;
      e.preventDefault();
      draggingElementsRef.current.style.left = e.clientX + 'px';
      draggingElementsRef.current.style.top = e.clientY + 'px';
    },
    [isDragging]
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
        backgroundWindowRef.current.contains(e.target as Node) &&
        rootKeyQuery.isSuccess
      ) {
        targetFolderKey = rootKeyQuery.data;
      }

      // Search for the target folder from the windows
      if (currentWindow && currentWindow.ref.current) {
        const window = findWindow(currentWindow.key);
        if (window && window.type === 'navigator') {
          targetFolderKey = window.targetKey;
        }
      }

      // Search for the target folder from the elements
      if (
        currentElement &&
        getElementInfo(currentElement.key)?.type === 'folder'
      ) {
        targetFolderKey = currentElement.key;
      }

      // Move the selected elements to the target folder
      if (targetFolderKey && pointerMoved) {
        selectedKeys.forEach((key) => {
          const info = getElementInfo(key);
          if (!isSelected(key) || key === targetFolderKey || !info) return;
          if (info.type === 'folder') {
            moveFolder(key, targetFolderKey).then(() => {
              queryClient.invalidateQueries({
                queryKey: generateQueryKey('folder', targetFolderKey),
              });
              queryClient.invalidateQueries({
                queryKey: generateQueryKey('folder', info.parentKey),
              });
            });
          } else if (info.type === 'file') {
            moveFile(key, targetFolderKey).then(() => {
              queryClient.invalidateQueries({
                queryKey: generateQueryKey('folder', targetFolderKey),
              });
              queryClient.invalidateQueries({
                queryKey: generateQueryKey('folder', info.parentKey),
              });
            });
          }
        });
      }
    },
    [
      backgroundWindowRef,
      currentElement,
      currentWindow,
      findWindow,
      getElementInfo,
      isDragging,
      isSelected,
      pointerMoved,
      queryClient,
      rootKeyQuery.data,
      rootKeyQuery.isSuccess,
      selectedKeys,
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
      ></div>
      {children}
    </div>
  );
};
