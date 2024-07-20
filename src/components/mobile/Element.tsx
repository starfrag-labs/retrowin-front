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
import { memo } from 'react';
import { useMobileElementStore } from '../../store/mobile/element.store';

export const Element = memo(
  ({
    elementKey,
    name,
    type,
    parentKey,
    selected,
    selecting,
  }: {
    elementKey: string;
    name: string;
    type: string;
    parentKey: string;
    selected: boolean;
    selecting: boolean;
  }) => {
    const contentType = getContentType(name);
    const selectTime = 500;
    let timer: NodeJS.Timeout;
    const navigate = useNavigate({ from: '/m/$folderKey' });

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
      if (selected) {
        unselectElement(elementKey);
      } else {
        selectElement(elementKey);
      }
    };

    const touchStart = () => {
      timer = setTimeout(onLongTouch, selectTime);
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
            <ImagePreview elementKey={elementKey} parentKey={parentKey} />
          ) : (
            <FaFileAlt className={fileIcon} />
          )}
        </div>
        <div className={elementNameContainer}>{name}</div>
      </div>
    );
  }
);
