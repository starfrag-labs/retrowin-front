import { useCallback, useEffect, useRef, useState } from 'react';
import { useMenuStore } from '../../../store/menu.store';
import { ElementOptionMenu } from './ElementOptionMenu';
import { BackgroundOptionMenu } from './BackgroundOptionMenu';
import { WindowOptionsMenu } from './WindowOptionMenu';
import { useElementStore } from '../../../store/element.store';
import { useWindowStore } from '../../../store/window.store';
import { useEventStore } from '../../../store/event.store';
import { defaultContainer } from '../../../styles/common/container.css';
import { menuContainer } from '../../../styles/pc/menu.css';

export const OptionMenu = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  // Refs
  const menuRef = useRef<HTMLDivElement>(null);

  // states
  const [targetWindowKey, setTargetWindowKey] = useState('');
  const [targetElementKey, setTargetElementKey] = useState('');
  const [menuType, setMenuType] = useState('');

  // store states
  const currentElement = useElementStore((state) => state.currentElement);
  const currentWindow = useWindowStore((state) => state.currentWindow);
  const pressedKeys = useEventStore((state) => state.pressedKeys);

  // store functions
  const setMenuRef = useMenuStore((state) => state.setMenuRef);
  const selectKey = useElementStore((state) => state.selectKey);
  const isSelected = useElementStore((state) => state.isSelected);
  const unselectAllKys = useElementStore((state) => state.unselectAllKeys);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const currentMenu = menuRef.current;
      if (currentMenu) {
        e.preventDefault();
        currentMenu.style.top = `${e.clientY}px`;
        currentMenu.style.left = `${e.clientX}px`;

        // Set the menu type to background by default
        setMenuType('background');

        // Check if the right-clicked element is a window
        if (currentWindow) {
          setTargetWindowKey(currentWindow.key);
          setMenuType('window');
        }

        // Check if the right-clicked element is an element
        if (currentElement) {
          if (
            !pressedKeys.includes('Control') &&
            !isSelected(currentElement.key)
          ) {
            unselectAllKys();
          }
          setTargetElementKey(currentElement.key);
          setMenuType('element');
          selectKey(currentElement.key);
        }

        currentMenu.style.display = 'block';
      }
    },
    [
      currentElement,
      currentWindow,
      isSelected,
      pressedKeys,
      selectKey,
      unselectAllKys,
    ]
  );

  const closeMenu = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      const currentMenu = menuRef.current;
      if (!currentMenu) return;
      if (e.target !== currentMenu && !currentMenu.contains(e.target as Node)) {
        currentMenu.style.display = 'none';
      }
    }
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [closeMenu]);

  useEffect(() => {
    if (menuRef.current) {
      setMenuRef(menuRef);
    }
  }, [setMenuRef]);

  return (
    <div className={defaultContainer} onContextMenu={handleContextMenu}>
      {children}
      <div className={menuContainer} ref={menuRef}>
        {menuType === 'element' && (
          <ElementOptionMenu elementKey={targetElementKey} menuRef={menuRef} />
        )}
        {menuType === 'window' && (
          <WindowOptionsMenu windowKey={targetWindowKey} menuRef={menuRef} />
        )}
        {menuType === 'background' && (
          <BackgroundOptionMenu menuRef={menuRef} />
        )}
      </div>
    </div>
  );
};
