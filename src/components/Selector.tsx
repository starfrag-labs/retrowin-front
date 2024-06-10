import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { selector } from "../css/styles/selector.css";
import React from "react";
import { useRefStore } from "../store/ref.store";
import { useElementStore } from "../store/element.store";

export const Selector = ({
  children,
  parentRef,
}: {
  children: React.ReactNode;
  parentRef: React.RefObject<HTMLElement>;
}): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const selectorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
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
      if (parentRef.current !== e.target) {
        return;
      }
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.pageX);
      setStartY(e.pageY);
      boxRef.current.style.display = 'block';
    },
    [elementsRef, parentRef]
  );

  const onDragEnd = useCallback((e: MouseEvent) => {
    if (boxRef.current === null) {
      return;
    }
    e.preventDefault();
    setIsDragging(false);
    boxRef.current.style.width = '0px';
    boxRef.current.style.height = '0px';
    boxRef.current.style.left = '0px';
    boxRef.current.style.top = '0px';
    boxRef.current.style.display = 'none';
  }, []);

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

  // working on this
  // same function in element.tsx will be deleted
  const handleClickElement = useCallback(
    (key: string) => {
      if (selectedElements.indexOf(key) !== -1) {
        unselectElement(key);
        setSelectedElements((prev) => prev.filter((k) => k !== key));
      } else {
        selectElement(key);
        setSelectedElements((prev) => [...prev, key]);
      }
    },
    [selectedElements, selectElement, unselectElement]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      elementsRef.current?.forEach((el, key) => {
        if (el.contains(e.target as Node)) {
          return;
        }
        unselectElement(key);
      });
    },
    [elementsRef, unselectElement]
  );

  useEffect(() => {
    console.log('elementsRef', elementsRef);
  }, [elementsRef]);

  useEffect(() => {
    document.addEventListener('mousedown', onDragStart);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', onDragStart);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, onDrag, onDragEnd, onDragStart]);

  return (
    <div ref={selectorRef}>
      {createElement('div', { className: selector, ref: boxRef })}
      {children}
    </div>
  );
};