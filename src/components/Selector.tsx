import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import { selector } from '../css/styles/selector.css';
import React from 'react';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';
import { draggingElementsIcon } from '../css/styles/element.css';
import { PiFilesFill } from 'react-icons/pi';

export const Selector = ({
  children,
  parentRef,
}: {
  children: React.ReactNode;
  parentRef: React.RefObject<HTMLElement>;
}): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const selectorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const movingElementsRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRefStore((state) => state.elementsRef);
  const selectElement = useElementStore((state) => state.selectElement);
  const unselectElement = useElementStore((state) => state.unselectElement);

  const checkElements = useCallback(() => {
    if (elementsRef.current === null) {
      return;
    }
    elementsRef.current.forEach((el, key) => {
      if (boxRef.current === null) {
        return;
      }
      const boxRect = boxRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      if (
        boxRect.left < elRect.right &&
        boxRect.right > elRect.left &&
        boxRect.top < elRect.bottom &&
        boxRect.bottom > elRect.top &&
        selectedElements.indexOf(key) === -1
      ) {
        selectElement(key);
        setSelectedElements((prev) => [...prev, key]);
      } else if (
        selectedElements.indexOf(key) !== -1 &&
        (boxRect.left > elRect.right ||
          boxRect.right < elRect.left ||
          boxRect.top > elRect.bottom ||
          boxRect.bottom < elRect.top)
      ) {
        unselectElement(key);
        setSelectedElements((prev) => prev.filter((k) => k !== key));
      }
    });
  }, [elementsRef, selectedElements, selectElement, unselectElement]);

  const onDragStart = useCallback(
    (e: MouseEvent) => {
      if (
        selectorRef.current === null ||
        boxRef.current === null ||
        parentRef.current === null ||
        elementsRef.current === null
      ) {
        return;
      }
      if (parentRef.current === e.target) {
        e.preventDefault();
        // start selecting
        setIsDragging(true);
        setStartX(e.pageX);
        setStartY(e.pageY);
        boxRef.current.style.display = 'block';
        // unselect all elements
        setSelectedElements([]);
        elementsRef.current.forEach((_el, key) => {
          unselectElement(key);
        });
        return;
      }
    },
    [elementsRef, parentRef, unselectElement]
  );

  const onDragEnd = useCallback(
    (e: MouseEvent) => {
      if (boxRef.current === null || isDragging === false) {
        return;
      }
      e.preventDefault();
      setIsDragging(false);
      boxRef.current.style.width = '0px';
      boxRef.current.style.height = '0px';
      boxRef.current.style.left = '0px';
      boxRef.current.style.top = '0px';
      boxRef.current.style.display = 'none';
    },
    [isDragging]
  );

  const onDrag = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (isDragging && boxRef.current) {
        const x = e.pageX;
        const y = e.pageY;
        boxRef.current.style.left = Math.min(x, startX) + 'px';
        boxRef.current.style.top = Math.min(y, startY) + 'px';
        boxRef.current.style.width = Math.abs(x - startX) + 'px';
        boxRef.current.style.height = Math.abs(y - startY) + 'px';
        checkElements();
      }
    },
    [checkElements, isDragging, startX, startY]
  );

  useEffect(() => {
    document.addEventListener('mousedown', onDragStart);
    return () => {
      document.removeEventListener('mousedown', onDragStart);
    };
  }, [onDragStart]);

  useEffect(() => {
    document.addEventListener('mouseup', onDragEnd);
    return () => {
      document.removeEventListener('mouseup', onDragEnd);
    };
  }, [onDragEnd]);

  useEffect(() => {
    document.addEventListener('mousemove', onDrag);
    return () => {
      document.removeEventListener('mousemove', onDrag);
    };
  }, [onDrag]);

  const moveElementsStart = useCallback(
    (e: MouseEvent) => {
      if (selectedElements.length === 0) {
        return;
      }
      if (elementsRef.current === null || movingElementsRef.current === null) {
        return;
      }
      e.preventDefault();
      setIsMoving(true);
      movingElementsRef.current.style.display = 'block';
      document.body.style.cursor = 'grabbing';
    },
    [elementsRef, selectedElements]
  );

  const moveElementsEnd = useCallback(
    (e: MouseEvent) => {
      if (isMoving && movingElementsRef.current) {
        e.preventDefault();
        setIsMoving(false);
        movingElementsRef.current.style.display = 'none';
        document.body.style.cursor = 'auto';
      }
    },
    [isMoving]
  );

  const moveElements = useCallback(
    (e: MouseEvent) => {
      if (isMoving && movingElementsRef.current) {
        e.preventDefault();
        if (elementsRef.current === null) {
          return;
        }
        const x = e.pageX;
        const y = e.pageY;
        movingElementsRef.current.style.left = x + 'px';
        movingElementsRef.current.style.top = y + 'px';
      }
    },
    [isMoving, elementsRef]
  );

  // useEffect(() => {
  //   document.addEventListener('mousedown', moveElementsStart);
  //   return () => {
  //     document.removeEventListener('mousedown', moveElementsStart);
  //   };
  // }, [moveElementsStart]);

  // useEffect(() => {
  //   document.addEventListener('mouseup', moveElementsEnd);
  //   return () => {
  //     document.removeEventListener('mouseup', moveElementsEnd);
  //   };
  // }, [moveElementsEnd]);

  // useEffect(() => {
  //   document.addEventListener('mousemove', moveElements);
  //   return () => {
  //     document.removeEventListener('mousemove', moveElements);
  //   };
  // }, [moveElements]);

  return (
    <div ref={selectorRef}>
      <div className={selector} ref={boxRef} />
      {children}
    </div>
  );
};
