import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import { useRefStore } from '../store/ref.store';
import { useElementStore } from '../store/element.store';
import { draggingElementsIcon } from '../styles/element.css';
import { selector, selectBox } from '../styles/selector.css';

export const Selector = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [displayDraggingElements, setDisplayDraggingElements] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  const selectorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingElementsRef = useRef<HTMLDivElement>(null);

  const elementsRef = useRefStore((state) => state.elementsRef);
  const selectElement = useElementStore((state) => state.selectElement);
  const unselectElement = useElementStore((state) => state.unselectElement);

  const checkElementsInBox = useCallback(() => {
    if (elementsRef.current === null) {
      return;
    }
    if (boxRef.current && isDragging && selectorRef.current) {
      const boxRect = boxRef.current.getBoundingClientRect();
      const currentSelectorRef = selectorRef.current;

      elementsRef.current.forEach((el, key) => {
        if (!currentSelectorRef.contains(el)) {
          return;
        }
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
    }
  }, [
    elementsRef,
    isDragging,
    selectedElements,
    selectElement,
    unselectElement,
  ]);

  const onDragStart = useCallback(
    (e: MouseEvent) => {
      if (
        selectorRef.current === null ||
        boxRef.current === null ||
        elementsRef.current === null
      ) {
        return;
      }
      if (selectorRef.current === e.target) {
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
    [elementsRef, unselectElement]
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
        checkElementsInBox();
      }
    },
    [checkElementsInBox, isDragging, startX, startY]
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

  const clickElement = useCallback(
    (e: MouseEvent) => {
      const currentElements = elementsRef.current;
      const currentDraggingElements = draggingElementsRef.current;
      const currentSelectorRef = selectorRef.current;
      if (
        currentElements === null ||
        currentSelectorRef === null ||
        currentDraggingElements === null
      ) {
        return;
      }
      if (!currentSelectorRef.contains(e.target as Node)) {
        setSelectedElements([]);
        selectedElements.forEach((key) => {
          unselectElement(key);
        });
        return;
      }

      currentElements.forEach((el, key) => {
        if (!currentSelectorRef.contains(el)) {
          return;
        }
        const elRect = el.getBoundingClientRect();
        if (
          e.pageX > elRect.left &&
          e.pageX < elRect.right &&
          e.pageY > elRect.top &&
          e.pageY < elRect.bottom
        ) {
          if (selectedElements.indexOf(key) === -1 && !e.shiftKey) {
            setSelectedElements([key]);
            selectedElements.forEach((k) => {
              if (k !== key) {
                unselectElement(k);
              }
            });
            selectElement(key);

            // start moving the element
            e.preventDefault();
            setDisplayDraggingElements(false);
            setStartX(e.pageX);
            setStartY(e.pageY);
            setIsMoving(true);

            // create a clone of the element
            const clone = el.cloneNode(true) as HTMLElement;
            clone.style.position = 'absolute';
            clone.style.left = elRect.left + 'px';
            clone.style.top = elRect.top + 'px';
            currentDraggingElements.appendChild(clone);
          } else if (selectedElements.indexOf(key) === -1 && e.shiftKey) {
            selectElement(key);
            setSelectedElements((prev) => [...prev, key]);
          }
        }
      });
    },
    [elementsRef, selectedElements, selectElement, unselectElement]
  );

  useEffect(() => {
    document.addEventListener('mousedown', clickElement);
    return () => {
      document.removeEventListener('mousedown', clickElement);
    };
  }, [clickElement]);

  const moveElementsStart = useCallback(
    (e: MouseEvent) => {
      const currentElements = elementsRef.current;
      const currentDraggingElements = draggingElementsRef.current;

      if (currentElements === null || currentDraggingElements === null) {
        return;
      }
      if (selectedElements.length === 0) {
        return;
      }
      setStartX(e.pageX);
      setStartY(e.pageY);
      setIsMoving(true);
      e.preventDefault();
      currentElements.forEach((el, key) => {
        if (selectedElements.indexOf(key) !== -1) {
          const clone = el.cloneNode(true) as HTMLElement;
          clone.style.position = 'absolute';
          clone.style.left = el.getBoundingClientRect().left + 'px';
          clone.style.top = el.getBoundingClientRect().top + 'px';
          currentDraggingElements.appendChild(clone);
        }
      });
      currentDraggingElements.style.left = '0px';
      currentDraggingElements.style.top = '0px';
    },
    [elementsRef, selectedElements]
  );

  const moveElementsEnd = useCallback(
    (e: MouseEvent) => {
      if (isMoving && draggingElementsRef.current) {
        e.preventDefault();
        setIsMoving(false);
        setDisplayDraggingElements(false);
        document.body.style.cursor = 'default';
        while (draggingElementsRef.current.firstChild) {
          draggingElementsRef.current.removeChild(
            draggingElementsRef.current.firstChild
          );
        }
      }
    },
    [isMoving]
  );

  const moveElements = useCallback(
    (e: MouseEvent) => {
      const currentElements = elementsRef.current;
      const currentDraggingElements = draggingElementsRef.current;
      if (
        isMoving &&
        currentElements !== null &&
        currentDraggingElements !== null
      ) {
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        currentDraggingElements.style.left = x - startX + 'px';
        currentDraggingElements.style.top = y - startY + 'px';

        if (
          !displayDraggingElements &&
          isMoving &&
          currentElements &&
          (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10)
        ) {
          document.body.style.cursor = 'grabbing';
          setDisplayDraggingElements(true);
        }
      }
    },
    [elementsRef, displayDraggingElements, isMoving, startX, startY]
  );

  useEffect(() => {
    document.addEventListener('mousedown', moveElementsStart);
    return () => {
      document.removeEventListener('mousedown', moveElementsStart);
    };
  }, [moveElementsStart]);

  useEffect(() => {
    document.addEventListener('mouseup', moveElementsEnd);
    return () => {
      document.removeEventListener('mouseup', moveElementsEnd);
    };
  }, [moveElementsEnd]);

  useEffect(() => {
    document.addEventListener('mousemove', moveElements);
    return () => {
      document.removeEventListener('mousemove', moveElements);
    };
  }, [moveElements]);

  return (
    <div className={selector} ref={selectorRef}>
      <div
        className={draggingElementsIcon}
        ref={draggingElementsRef}
        hidden={!displayDraggingElements}
      />
      <div className={selectBox} ref={boxRef} />
      {children}
    </div>
  );
};
