import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventStore } from '../../store/event.store';
import { useWindowStore } from '../../store/window.store';
import { getRootFolderKeyQueryOption } from '../../utils/queryOptions/folder.query';
import { useQuery } from '@tanstack/react-query';
import { useElementStore } from '../../store/element.store';
import { useSelectorStore } from '../../store/selector.store';
import { useMenuStore } from '../../store/menu.store';
import { selector, selectBox } from '../../styles/pc/selector.css';

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
  const menuRef = useMenuStore((state) => state.menuRef);
  const resizing = useEventStore((state) => state.resizing);
  const renaming = useEventStore((state) => state.renaming);
  const currentWindow = useWindowStore((state) => state.currentWindow);
  const backgroundWindowRef = useWindowStore(
    (state) => state.backgroundWindowRef
  );
  const pressedKeys = useEventStore((state) => state.pressedKeys);
  const currentElement = useElementStore((state) => state.currentElement);

  // Store functions
  const unselectAllKeys = useElementStore((state) => state.unselectAllKeys);
  const setRect = useSelectorStore((state) => state.setRect);
  const setCurrentWindowKey = useSelectorStore(
    (state) => state.setCurrentWindowKey
  );

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
      if (!pressedKeys.includes('Control')) {
        unselectAllKeys();
      }

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

      // Get window refs
      if (currentWindow && currentWindow.ref.current) {
        setTargetWindowRect(currentWindow.ref.current.getBoundingClientRect());
        setCurrentWindowKey(currentWindow.key);
        setIsSelecting(true);
      }
    },
    [
      backgroundWindowRef,
      currentElement,
      currentWindow,
      menuRef,
      pressedKeys,
      renaming,
      resizing,
      rootKeyQuery.data,
      rootKeyQuery.isSuccess,
      setCurrentWindowKey,
      unselectAllKeys,
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
