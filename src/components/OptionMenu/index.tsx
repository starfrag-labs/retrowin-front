import { useCallback, useEffect, useRef, useState } from 'react';
import { useRefStore } from '../../store/menu.store';
import { defaultContainer } from '../../styles/global/container.css';
import { ElementOptionMenu } from './ElementOptionMenu';
import { menuContainer } from '../../styles/menu.css';
import { BackgroundOptionMenu } from './BackgroundOptionMenu';
import { WindowOptionsMenu } from './WindowOptionMenu';
import { useElementStore } from '../../store/element.store';
import { useWindowStore } from '../../store/window.store';

export const OptionMenu = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const currentElement = useElementStore((state) => state.currentElement);
  const windowRefs = useWindowStore((state) => state.windowRefs);
  const menuRef = useRef<HTMLDivElement>(null);
  const setMenuRef = useRefStore((state) => state.setMenuRef);

  const [targetWindowKey, setTargetWindowKey] = useState('');
  const [targetElementKey, setTargetElementKey] = useState('');
  const [menuType, setMenuType] = useState('');

  const handleContextMenu = (e: React.MouseEvent) => {
    const currentMenu = menuRef.current;
    if (currentMenu) {
      e.preventDefault();
      currentMenu.style.top = `${e.clientY}px`;
      currentMenu.style.left = `${e.clientX}px`;

      // Set the menu type to background by default
      setMenuType('background');

      // Check if the right-clicked element is a window
      if (windowRefs) {
        windowRefs.forEach((window, key) => {
          if (window.current && window.current.contains(e.target as Node)) {
            setTargetWindowKey(key);
            setMenuType('window');
          }
        });
      }

      // Check if the right-clicked element is an element
      if (currentElement) {
        setTargetElementKey(currentElement.key);
        setMenuType('element');
      }

      currentMenu.style.display = 'block';
    }
  };

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
