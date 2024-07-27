import { useCallback, useEffect, useRef, useState } from 'react';
import { useRefStore } from '../store/ref.store';
import { draggingElementsIcon } from '../styles/element.css';
import { moveFile, moveFolder } from '../api/cloud';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getRootFolderKeyQueryOption,
  readFolderQueryOption,
} from '../utils/queryOptions/folder.query';
import { defaultContainer } from '../styles/global/container.css';
import { useEventStore } from '../store/event.store';
import { useWindowStore } from '../store/window.store';
import { useElementStore } from '../store/element.store';

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
  const elementRefs = useRefStore((state) => state.elementRefs);
  const windowRefs = useRefStore((state) => state.windowRefs);
  const backgroundWindowRef = useRefStore((state) => state.backgroundWindowRef);
  const menuRef = useRefStore((state) => state.menuRef);
  const resizing = useEventStore((state) => state.resizing);
  const renaming = useEventStore((state) => state.renaming);
  const getElementInfo = useElementStore((state) => state.getElementInfo);

  // Store functions
  const findWindow = useWindowStore((state) => state.findWindow);

  // Element v3
  const isSelected = useElementStore((state) => state.isSelected);
  const selectKey = useElementStore((state) => state.selectKey);
  const unselectAllKeys = useElementStore((state) => state.unselectAllKeys);

  // Query
  const rootKeyQuery = useQuery(getRootFolderKeyQueryOption());

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
      let isElement = false;
      elementRefs.forEach((elementRef, key) => {
        if (elementRef.current?.contains(e.target as Node)) {
          isElement = true;
          if (!isSelected(key) && !shiftKey) {
            unselectAllKeys();
          }
          selectKey(key);
        }
      });
      // If the mouse event is not triggered on an element, return
      if (!isElement) return;
      setPointerMoved(false); // Reset the pointerMoved state
      setIsDraggingReady(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
    },
    [
      elementRefs,
      isSelected,
      menuRef,
      renaming,
      resizing,
      selectKey,
      shiftKey,
      unselectAllKeys,
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
        elementRefs.forEach((elementRef, key) => {
          let contained = false;
          if (elementRef.current?.contains(e.target as Node)) {
            contained = true;
          }
          if (!isSelected(key) && !contained) return;
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
    [
      elementRefs,
      isDragging,
      isDraggingReady,
      isSelected,
      startX,
      startY,
    ]
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
        backgroundWindowRef.current.contains(e.target as Node) &&
        rootKeyQuery.isSuccess
      ) {
        targetFolderKey = rootKeyQuery.data;
      }

      // Search for the target folder from the windows
      windowRefs.forEach((windowRef, key) => {
        const window = findWindow(key);
        if (
          window &&
          windowRef.current?.contains(e.target as Node) &&
          window.type === 'navigator'
        ) {
          targetFolderKey = window.targetKey;
        }
      });

      // Search for the target folder from the elements
      elementRefs.forEach((elementRef, key) => {
        const info = getElementInfo(key);
        if (
          elementRef.current?.contains(e.target as Node) &&
          info?.type === 'folder'
        ) {
          targetFolderKey = key;
        }
      });

      // Move the selected elements to the target folder
      if (targetFolderKey && pointerMoved) {
        elementRefs.forEach((_elementRef, key) => {
          const info = getElementInfo(key);
          if (!isSelected(key) || key === targetFolderKey || !info) return;
          if (info.type === 'folder') {
            moveFolder(key, targetFolderKey).then(() => {
              queryClient.invalidateQueries(
                readFolderQueryOption(targetFolderKey)
              );
              queryClient.invalidateQueries(readFolderQueryOption(key));
            });
          } else if (info.type === 'file') {
            moveFile(key, targetFolderKey).then(() => {
              queryClient.invalidateQueries(
                readFolderQueryOption(targetFolderKey)
              );
              queryClient.invalidateQueries(readFolderQueryOption(key));
            });
          }
        });
      }
    },
    [
      backgroundWindowRef,
      elementRefs,
      findWindow,
      getElementInfo,
      isDragging,
      isSelected,
      pointerMoved,
      queryClient,
      rootKeyQuery.data,
      rootKeyQuery.isSuccess,
      windowRefs,
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
