import { useCallback, useEffect, useRef, useState } from 'react';
import { selectBox, selector } from '../styles/selector.css';
import { useRefStore } from '../store/ref.store';
import { useEventStore } from '../store/event.store';
import { useWindowStore } from '../store/window.store';
import { getRootFolderKeyQueryOption, readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useElementStoreV3 } from '../store/element.store.v3';
import { ReadFolderData } from '../types/response';

export const Selector = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const queryClient = useQueryClient();

  // States
  const [isSelecting, setIsSelecting] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [shiftKey, setShiftKey] = useState(false);
  const [targetWindowRect, setTargetWindowRect] = useState<DOMRect>(
    document.body.getBoundingClientRect()
  );
  const [currentWindowTargetKey, setCurrentWindowTargetKey] = useState<
    string | undefined
  >();

  // Queries
  const rootKeyQuery = useQuery(getRootFolderKeyQueryOption());
  const readQuery = useQuery(readFolderQueryOption(currentWindowTargetKey || ''));

  // Refs
  const selectorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Store states
  const menuRef = useRefStore((state) => state.menuRef);
  const resizing = useEventStore((state) => state.resizing);
  const renaming = useEventStore((state) => state.renaming);
  const windowsRef = useRefStore((state) => state.windowsRef);
  const backgroundWindowRef = useRefStore((state) => state.backgroundWindowRef);
  const elementsRef = useRefStore((state) => state.elementsRef);

  // Store functions
  const selectKey = useElementStoreV3((state) => state.selectKey);
  const unselectKey = useElementStoreV3((state) => state.unselectKey);
  const unselectAllKeys = useElementStoreV3((state) => state.unselectAllKeys);
  const findWindow = useWindowStore((state) => state.findWindow);


  // Keyboard event listeners
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

  // Selecting start event listener
  const selectingStart = useCallback(
    (e: MouseEvent) => {
      // Check if the mouse event is triggered on the menu
      const currentMenuRef = menuRef?.current;
      if (currentMenuRef && currentMenuRef.contains(e.target as Node)) return;
      if (resizing || renaming) return;

      // Check if the mouse event is triggered on an element
      let isElement = false;
      elementsRef.forEach((elementRef) => {
        if (elementRef.current?.contains(e.target as Node)) {
          isElement = true;
        }
      });
      if (isElement) return;

      setStartX(e.clientX);
      setStartY(e.clientY);
      unselectAllKeys();

      // Get target window
      const currentBackgroundWindowRef = backgroundWindowRef?.current;
      if (
        currentBackgroundWindowRef &&
        currentBackgroundWindowRef.contains(e.target as Node) &&
        rootKeyQuery.isSuccess
      ) {
        setTargetWindowRect(currentBackgroundWindowRef.getBoundingClientRect());
        setCurrentWindowTargetKey(rootKeyQuery.data);
        setIsSelecting(true);
      }
      if (windowsRef) {
        windowsRef.forEach((windowRef, windowKey) => {
          // Check if target is on a window's corner
          const currentWindowRef = windowRef.current;
          const window = findWindow(windowKey); // Get window by key
          if (!currentWindowRef || !window) return;
          if (currentWindowRef && currentWindowRef.contains(e.target as Node)) {
            setTargetWindowRect(currentWindowRef.getBoundingClientRect()); // Set target window rect
            setCurrentWindowTargetKey(
              window.type === 'navigator' ? window.targetKey : ''
            ); // Set current window target key
            setIsSelecting(true); // Start selecting
          }
        });
      }
    },
    [
      backgroundWindowRef,
      elementsRef,
      findWindow,
      menuRef,
      renaming,
      resizing,
      rootKeyQuery.data,
      rootKeyQuery.isSuccess,
      unselectAllKeys,
      windowsRef,
    ]
  );

  // Check elements in the box
  const checkElementsInBox = useCallback(() => {
    if (
      !elementsRef ||
      !boxRef.current ||
      !currentWindowTargetKey ||
      !readQuery.isSuccess ||
      !readQuery.data
    )
      return;
    const boxRect = boxRef.current.getBoundingClientRect();
    const elements = queryClient.getQueryData<ReadFolderData>([
      'folder',
      currentWindowTargetKey,
      'read',
    ]);

    if (!elements) return;

    elements.folders.forEach((folder) => {
      const elementRef = elementsRef.get(folder.key);
      if (!elementRef?.current) return;
      const elementRect = elementRef.current.getBoundingClientRect();
      if (
        boxRect.left < elementRect.right &&
        boxRect.right > elementRect.left &&
        boxRect.top < elementRect.bottom &&
        boxRect.bottom > elementRect.top
      ) {
        selectKey(folder.key);
      } else if (!shiftKey) {
        unselectKey(folder.key);
      }
    });
    elements.files.forEach((file) => {
      const elementRef = elementsRef.get(file.key);
      if (!elementRef?.current) return;
      const elementRect = elementRef.current.getBoundingClientRect();
      if (
        boxRect.left < elementRect.right &&
        boxRect.right > elementRect.left &&
        boxRect.top < elementRect.bottom &&
        boxRect.bottom > elementRect.top
      ) {
        selectKey(file.key);
      } else if (!shiftKey) {
        unselectKey(file.key);
      }
    });
  }, [
    currentWindowTargetKey,
    elementsRef,
    queryClient,
    readQuery.data,
    readQuery.isSuccess,
    selectKey,
    shiftKey,
    unselectKey,
  ]);

  // Selecting event listener
  const selecting = useCallback(
    (e: MouseEvent) => {
      if (!selectorRef.current || !boxRef.current || !isSelecting) return;
      const left = Math.max(Math.min(startX, e.clientX), targetWindowRect.left);
      const top = Math.max(Math.min(startY, e.clientY), targetWindowRect.top);
      const right = Math.min(
        Math.max(startX, e.clientX),
        targetWindowRect.right - 2
      );
      const bottom = Math.min(
        Math.max(startY, e.clientY),
        targetWindowRect.bottom - 3
      );
      const width = right - left;
      const height = bottom - top;

      boxRef.current.style.left = `${left}px`;
      boxRef.current.style.top = `${top}px`;
      boxRef.current.style.width = `${width}px`;
      boxRef.current.style.height = `${height}px`;
      boxRef.current.style.display = 'block';

      checkElementsInBox();
    },
    [
      isSelecting,
      startX,
      targetWindowRect.left,
      targetWindowRect.top,
      targetWindowRect.right,
      targetWindowRect.bottom,
      startY,
      checkElementsInBox,
    ]
  );

  // Selecting end event listener
  const selectingEnd = useCallback(() => {
    if (!boxRef.current) return;
    setIsSelecting(false);
    boxRef.current.style.display = 'none';
  }, []);

  // Event listeners
  useEffect(() => {
    document.addEventListener('mousedown', selectingStart);
    return () => {
      document.removeEventListener('mousedown', selectingStart);
    };
  }, [selectingStart]);

  useEffect(() => {
    document.addEventListener('mousemove', selecting);
    return () => {
      document.removeEventListener('mousemove', selecting);
    };
  }, [selecting]);

  useEffect(() => {
    document.addEventListener('mouseup', selectingEnd);
    return () => {
      document.removeEventListener('mouseup', selectingEnd);
    };
  }, [selectingEnd]);

  return (
    <div className={selector} ref={selectorRef}>
      <div className={selectBox} ref={boxRef} />
      {children}
    </div>
  );
};
