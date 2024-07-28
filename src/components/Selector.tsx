import { useCallback, useEffect, useRef, useState } from 'react';
import { selectBox, selector } from '../styles/selector.css';
import { useRefStore } from '../store/menu.store';
import { useEventStore } from '../store/event.store';
import { useWindowStore } from '../store/window.store';
import { getRootFolderKeyQueryOption } from '../utils/queryOptions/folder.query';
import { useQuery } from '@tanstack/react-query';
import { useElementStore } from '../store/element.store';
import { useSelectorStore } from '../store/selector.store';

export const Selector = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  // States
  const [isSelecting, setIsSelecting] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [targetWindowRect, setTargetWindowRect] = useState<DOMRect>(
    document.body.getBoundingClientRect()
  );

  // Queries
  const rootKeyQuery = useQuery(getRootFolderKeyQueryOption());

  // Refs
  const selectorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Store states
  const menuRef = useRefStore((state) => state.menuRef);
  const resizing = useEventStore((state) => state.resizing);
  const renaming = useEventStore((state) => state.renaming);
  const windowRefs = useWindowStore((state) => state.windowRefs);
  const backgroundWindowRef = useWindowStore(
    (state) => state.backgroundWindowRef
  );
  const shiftKey = useSelectorStore((state) => state.shiftKey);
  const currentElement = useElementStore((state) => state.currentElement);

  // Store functions
  const unselectAllKeys = useElementStore((state) => state.unselectAllKeys);
  const findWindow = useWindowStore((state) => state.findWindow);
  const setRect = useSelectorStore((state) => state.setRect);
  const setShiftKey = useSelectorStore((state) => state.setShiftKey);
  const setCurrentWindowKey = useSelectorStore(
    (state) => state.setCurrentWindowKey
  );

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
  }, [setShiftKey]);

  // Selecting start event listener
  const selectingStart = useCallback(
    (e: MouseEvent) => {
      // Check if the mouse event is triggered on the menu
      const currentMenuRef = menuRef?.current;
      if (currentMenuRef && currentMenuRef.contains(e.target as Node)) return;
      if (resizing || renaming) return;

      // Check if the mouse event is triggered on an element
      if (currentElement) return;

      setStartX(e.clientX);
      setStartY(e.clientY);
      document.body.style.cursor = 'default';
      if (!shiftKey) unselectAllKeys();

      // Get target window
      const currentBackgroundWindowRef = backgroundWindowRef?.current;
      if (
        currentBackgroundWindowRef &&
        currentBackgroundWindowRef.contains(e.target as Node) &&
        rootKeyQuery.isSuccess
      ) {
        setTargetWindowRect(currentBackgroundWindowRef.getBoundingClientRect());
        setCurrentWindowKey(rootKeyQuery.data);
        setIsSelecting(true);
      }
      if (windowRefs) {
        windowRefs.forEach((windowRef, windowKey) => {
          // Check if target is on a window's corner
          const currentWindowRef = windowRef.current;
          const window = findWindow(windowKey); // Get window by key
          if (!currentWindowRef || !window) return;
          if (currentWindowRef && currentWindowRef.contains(e.target as Node)) {
            setTargetWindowRect(currentWindowRef.getBoundingClientRect()); // Set target window rect
            setCurrentWindowKey(windowKey); // Set current window target key
            setIsSelecting(true); // Start selecting
          }
        });
      }
    },
    [
      backgroundWindowRef,
      currentElement,
      findWindow,
      menuRef,
      renaming,
      resizing,
      rootKeyQuery.data,
      rootKeyQuery.isSuccess,
      setCurrentWindowKey,
      shiftKey,
      unselectAllKeys,
      windowRefs,
    ]
  );

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

      setRect({
        ...boxRef.current.getBoundingClientRect(),
        left,
        top,
        right,
        bottom,
      });
    },
    [
      isSelecting,
      startX,
      targetWindowRect.left,
      targetWindowRect.top,
      targetWindowRect.right,
      targetWindowRect.bottom,
      startY,
      setRect,
    ]
  );

  // Selecting end event listener
  const selectingEnd = useCallback(() => {
    if (!boxRef.current) return;
    setIsSelecting(false);
    setRect(null);
    boxRef.current.style.display = 'none';
  }, [setRect]);

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
