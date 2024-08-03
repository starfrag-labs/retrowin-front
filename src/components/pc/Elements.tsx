import { Element } from './Element';
import { IElementState } from '../../types/store';
import { useWindowStore } from '../../store/window.store';
import { useQuery } from '@tanstack/react-query';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { useElementStore } from '../../store/element.store';
import { elementsContainer } from '../../styles/pc/element.css';

export const Elements = ({
  folderKey,
  isWindowElements = false,
}: {
  folderKey: string;
  isWindowElements?: boolean;
}): React.ReactElement => {
  const newWindow = useWindowStore((state) => state.newWindow);

  const readQuery = useQuery(readFolderQueryOption(folderKey));
  const renamingKey = useElementStore((state) => state.renamingKey);
  const selectedKeys = useElementStore((state) => state.selectedKeys);

  const uploadFileElement: IElementState = {
    key: 'upload-file',
    name: 'upload',
    type: 'upload',
    selected: false,
    renaming: false,
  };

  const handleDoubleClick = () => {
    newWindow(`${folderKey}_upload`, 'uploader');
  };

  return (
    <div className={elementsContainer}>
      <div onDoubleClick={handleDoubleClick}>
        <Element
          elementKey={uploadFileElement.key}
          name={uploadFileElement.name}
          parentKey={folderKey}
          type={uploadFileElement.type}
          selected={uploadFileElement.selected}
          renaming={uploadFileElement.renaming}
          isWindowElement={isWindowElements}
        />
      </div>
      {readQuery.isSuccess && readQuery.data && (
        <>
          {readQuery.data.folders.map((folder) => (
            <Element
              key={folder.key}
              elementKey={folder.key}
              name={folder.name}
              parentKey={folderKey}
              type="folder"
              selected={selectedKeys.includes(folder.key)}
              renaming={renamingKey === folder.key}
              isWindowElement={isWindowElements}
            />
          ))}
          {readQuery.data.files.map((file) => (
            <Element
              key={file.key}
              elementKey={file.key}
              name={file.name}
              parentKey={folderKey}
              type="file"
              selected={selectedKeys.includes(file.key)}
              renaming={renamingKey === file.key}
              isWindowElement={isWindowElements}
            />
          ))}
        </>
      )}
    </div>
  );
};
