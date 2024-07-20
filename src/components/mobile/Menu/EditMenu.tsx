import { useMobileElementStore } from '../../../store/mobile/element.store';
import { MdDeleteOutline } from 'react-icons/md';
import { RiFolderTransferLine } from 'react-icons/ri';
import { CgRename } from 'react-icons/cg';
import { MdDownload } from 'react-icons/md';
import { editMenu, editMenuItemIcon } from '../../../styles/mobile/menu.css';
import { useEffect, useState } from 'react';
import { MoveMenu } from './MoveMenu';

export const EditMenu = ({
  folderKey,
}: {
  folderKey: string;
}) => {
  const elements = useMobileElementStore((state) => state.elements);

  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  // Actions
  const findElementsByParentKey = useMobileElementStore(
    (state) => state.findElementsByParentKey
  );
  const unselectAll = useMobileElementStore((state) => state.unselectAllElements);

  // Functions
  const toggleMoving = () => {
    setIsMoving(!isMoving);
  };

  useEffect(() => {
    setSelectedElements(
      elements
        .filter((element) => element.selected)
        .map((element) => element.key)
    );
  }, [elements]);

  useEffect(() => {
    setIsFolderSelected(
      elements.some((element) => element.selected && element.type === 'folder')
    );
  }, [elements]);

  return (
    <div className={editMenu}>
      <MdDeleteOutline className={editMenuItemIcon} />
      <RiFolderTransferLine className={editMenuItemIcon} onTouchEnd={toggleMoving}/>
      {selectedElements.length === 1 && (
        <CgRename className={editMenuItemIcon} />
      )}
      {!isFolderSelected && <MdDownload className={editMenuItemIcon} />}
      {isMoving && <MoveMenu folderKey={folderKey} toggle={toggleMoving}/>}
    </div>
  );
};
