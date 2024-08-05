import { FaFolder, FaFileAlt } from 'react-icons/fa';
import {
  elementContainer,
  elementNameContainer,
  fileIcon,
  folderIcon,
  selectedElement,
} from '../../styles/mobile/element.css';
import { previewContainer } from '../../styles/mobile/preview.css';
import { getContentType } from '../../utils/customFn/contentTypeGetter';
import { PreviewImage } from './PreviewImage';
import { useNavigate } from '@tanstack/react-router';
import React, { memo, useState } from 'react';
import { useElementStore } from '../../store/element.store';
import { useQueryClient } from '@tanstack/react-query';
import { generateQueryKey } from '../../utils/queryOptions/index.query';

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

    const queryClient = useQueryClient();

    // State
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [startX, setStartX] = useState<number>(0);
    const [startY, setStartY] = useState<number>(0);

    // Actions
    const selectKey = useElementStore((state) => state.selectKey);
    const unselectKey = useElementStore((state) => state.unselectKey);

    const handleClick = () => {
      if (selecting && !selected) {
        selectKey(elementKey);
        return;
      } else if (selecting && selected) {
        unselectKey(elementKey);
        return;
      }

      if (type === 'folder') {
        queryClient.cancelQueries({ queryKey: generateQueryKey('file') });
        navigate({ to: '/m/$folderKey', params: { folderKey: elementKey } });
      } else if (contentType?.match('image') || contentType?.match('video')) {
        queryClient.cancelQueries({ queryKey: generateQueryKey('file') });
        navigate({ to: '/m/viewer/$fileKey', params: { fileKey: elementKey } });
      } else {
        // setActiveElementKey(elementKey);
      }
    };

    const onLongTouch = () => {
      setTimer(null);
      if (selected) {
        unselectKey(elementKey);
      } else {
        selectKey(elementKey);
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
        className={
          selected ? `${elementContainer} ${selectedElement}` : elementContainer
        }
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
      >
        <div className={previewContainer}>
          {type === 'folder' ? (
            <FaFolder className={folderIcon} />
          ) : contentType?.match('image') ? (
            <PreviewImage elementKey={elementKey} />
          ) : (
            <FaFileAlt className={fileIcon} />
          )}
        </div>
        <div className={elementNameContainer}>{name}</div>
      </div>
    );
  }
);
