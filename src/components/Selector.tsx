import { useEffect, useState } from "react";
import { selector } from "../css/styles/selector.css";
import { cloudBackground } from "../css/styles/background.css";

export const Selector = ({children}: {children: React.ReactNode}): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    function onDragStart(e: MouseEvent) {
      const selectElement = e.target as HTMLElement;
      if (selectElement.className !== cloudBackground) {
        return;
      }
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.pageX);
      setStartY(e.pageY);

      const box = document.createElement('div');
      box.className = selector;
      document.body.appendChild(box);
    }

    function onDragEnd(e: MouseEvent) {
      e.preventDefault();
      setIsDragging(false);
      document.querySelectorAll(`.${selector}`).forEach((box) => {
        box.remove();
      });
    }

    function onDrag(e: MouseEvent) {
      e.preventDefault();
      if (isDragging) {
        const x = e.pageX;
        const y = e.pageY;
        const box = document.querySelector(`.${selector}`) as HTMLDivElement;
        box.style.left = Math.min(x, startX) + 'px';
        box.style.top = Math.min(y, startY) + 'px';
        box.style.width = Math.abs(x - startX) + 'px';
        box.style.height = Math.abs(y - startY) + 'px';
      }
    }
    document.addEventListener('mousedown', onDragStart);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('mousemove', onDrag);
    return () => {
      document.removeEventListener('mousedown', onDragStart);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('mousemove', onDrag);
    };
  }, [isDragging, startX, startY]);

  return <div>{children}</div>;
}