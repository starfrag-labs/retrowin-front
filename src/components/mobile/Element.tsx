import { FaFolder, FaFileAlt } from 'react-icons/fa';
import {
  elementContainer,
  elementNameContainer,
  fileIcon,
  folderIcon,
} from '../../styles/mobile/element.css';
import { previewContainer } from '../../styles/mobile/preview.css';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { ImagePreview } from './ImagePreview';
import { useNavigate } from '@tanstack/react-router';
import React, { memo } from 'react';
import { useMobileElementStore } from '../../store/mobile/element.store';

export const Element = memo(
  ({
    elementKey,
    name,
    type,
    selected,
    selecting,
  }: {
    elementKey: string;
    name: string;
    type: string;
    selected: boolean;
    selecting: boolean;
  }): React.ReactElement => {
    const navigate = useNavigate({ from: '/m/$folderKey' });
    const contentType = getContentType(name);
    const selectTime = 400;
    const selectThreshold = 10;

    // State
    const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);
    const [startX, setStartX] = React.useState<number>(0);
    const [startY, setStartY] = React.useState<number>(0);

    // Actions
    const setActiveElementKey = useMobileElementStore(
      (state) => state.setActiveElementKey
    );
    const selectElement = useMobileElementStore((state) => state.selectElement);
    const unselectElement = useMobileElementStore(
      (state) => state.unselectElement
    );

    const handleClick = () => {
      if (selecting && !selected) {
        selectElement(elementKey);
        return;
      } else if (selecting && selected) {
        unselectElement(elementKey);
        return;
      }
      if (type === 'folder') {
        navigate({ to: '/m/$folderKey', params: { folderKey: elementKey } });
      } else if (contentType?.match('image') || contentType?.match('video')) {
        navigate({ to: '/m/viewer/$fileKey', params: { fileKey: elementKey } });
      } else {
        setActiveElementKey(elementKey);
      }
    };

    const onLongTouch = () => {
      setTimer(null);
      if (selected) {
        unselectElement(elementKey);
      } else {
        selectElement(elementKey);
      }
    };

    const touchStart = (e: React.TouchEvent) => {
      setStartX(e.touches[0].clientX);
      setStartY(e.touches[0].clientY);
      const timerId = setTimeout(onLongTouch, selectTime);
      setTimer(timerId);

      const touchMove = (e: TouchEvent) => {
        if (
          Math.abs(e.touches[0].clientX - startX) > selectThreshold ||
          Math.abs(e.touches[0].clientY - startY) > selectThreshold
        ) {
          clearTimeout(timerId);
          setTimer(null);
        }
      };

      window.addEventListener('touchmove', touchMove, { passive: true });

      window.addEventListener('touchend', () => {
        window.removeEventListener('touchmove', touchMove);
      });
    };

    const touchEnd = () => {
      if (timer) {
        clearTimeout(timer);
        handleClick();
      }
    };

    return (
      <div
        className={elementContainer}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        style={{
          backgroundColor: selected ? '#f0f0f0' : 'transparent',
        }}
      >
        <div className={previewContainer}>
          {type === 'folder' ? (
            <FaFolder className={folderIcon} />
          ) : contentType?.match('image') ? (
            <ImagePreview elementKey={elementKey} />
          ) : (
            <FaFileAlt className={fileIcon} />
          )}
        </div>
        <div className={elementNameContainer}>{name}</div>
      </div>
    );
  }
);
