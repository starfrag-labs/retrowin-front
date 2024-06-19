import { useCallback, useEffect, useRef, useState } from 'react';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';
import { draggingElementsIcon } from '../styles/element.css';
import { moveFile, moveFolder } from '../api/cloud';
import { useTokenStore } from '../store/token.store';
import { useQueryClient } from '@tanstack/react-query';
import { readFolderQueryOption } from '../utils/queryOptions/folder.query';
import { defaultContainer } from '../styles/global/container.css';

export const Dragger = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [displayDraggingElements, setDisplayDraggingElements] = useState(false);
  const [pointerMoved, setPointerMoved] = useState(false); // To prevent the click event from being triggered when dragging

  const draggingElementsRef = useRef<HTMLDivElement>(null);

  const accessToken = useTokenStore((state) => state.accessToken);
  const elements = useElementStore((state) => state.elements);
  const elementsRef = useRefStore((state) => state.elementsRef);
  const windowsRef = useRefStore((state) => state.windowsRef);
  const backgroundWindowRef = useRefStore((state) => state.backgroundWindowRef);
  const rootKey = useElementStore((state) => state.rootKey);

  const selectElement = useElementStore((state) => state.selectElement);
  const findElement = useElementStore((state) => state.findElement);
  const moveElement = useElementStore((state) => state.moveElement);

  const dragElementStart = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (!draggingElementsRef.current) return;
      e.preventDefault();
      setStartX(e.pageX);
      setStartY(e.pageY);
      elementsRef.forEach((elementRef, key) => {
        const element = findElement(key);
        if (elementRef.current?.contains(e.target as Node)) {
          setIsDragging(true);
          setPointerMoved(false); // Reset the pointerMoved state
          selectElement(key);
        }
        if (!element?.selected) return;
        const clone = elementRef.current?.cloneNode(true) as HTMLDivElement;
        clone.style.position = 'absolute';
        clone.style.left =
          elementRef.current?.getBoundingClientRect().left + 'px';
        clone.style.top =
          elementRef.current?.getBoundingClientRect().top + 'px';
        draggingElementsRef.current?.appendChild(clone);
      });
      draggingElementsRef.current.style.left = '0px';
      draggingElementsRef.current.style.top = '0px';
    },
    [elementsRef, findElement, selectElement]
  );

  const dragElement = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      if (!draggingElementsRef.current) return;
      e.preventDefault();
      draggingElementsRef.current.style.left = e.pageX - startX + 'px';
      draggingElementsRef.current.style.top = e.pageY - startY + 'px';

      if (
        isDragging &&
        Math.abs(e.pageX - startX) > 5 &&
        Math.abs(e.pageY - startY) > 5
      ) {
        document.body.style.cursor = 'grabbing';
        setDisplayDraggingElements(true);
        setPointerMoved(true);
      }
    },
    [isDragging, startX, startY]
  );

  const dragElementEnd = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      if (!draggingElementsRef.current) return;

      e.preventDefault();
      setIsDragging(false);
      setDisplayDraggingElements(false);
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
        if (
          windowRef.current?.contains(e.target as Node) &&
          findElement(key)?.type === 'folder'
        ) {
          targetFolderKey = key;
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
          if (element.selected && element.type === 'folder') {
            moveFolder(accessToken, element.key, targetFolderKey).then(() => {
              queryClient.invalidateQueries(
                readFolderQueryOption(accessToken, targetFolderKey)
              );
              queryClient.invalidateQueries(
                readFolderQueryOption(accessToken, element.parentKey)
              );
              moveElement(element.key, targetFolderKey);
            });
          } else if (element.selected && element.type === 'file') {
            moveFile(
              accessToken,
              element.parentKey,
              element.key,
              targetFolderKey
            ).then(() => {
              queryClient.invalidateQueries(
                readFolderQueryOption(accessToken, targetFolderKey)
              );
              queryClient.invalidateQueries(
                readFolderQueryOption(accessToken, element.parentKey)
              );
              moveElement(element.key, targetFolderKey);
            });
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
      findElement,
      elements,
      accessToken,
      queryClient,
      moveElement,
    ]
  );

  useEffect(() => {
    document.addEventListener('mousedown', dragElementStart);
    return () => {
      document.removeEventListener('mousedown', dragElementStart);
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
