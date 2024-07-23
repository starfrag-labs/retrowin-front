import {
  elementsContainer,
  emptyFolderMessage,
} from '../../styles/mobile/element.css';
import { Element } from './Element';
import { useQuery } from '@tanstack/react-query';
import { readFolderQueryOption } from '../../utils/queryOptions/folder.query';
import { useMobileElementStore } from '../../store/mobile/element.store';

export const Elements = ({
  folderKey,
  selecting,
}: {
  folderKey: string;
  selecting: boolean;
}): React.ReactElement => {
  const readQuery = useQuery(readFolderQueryOption(folderKey));

  const isSelected = useMobileElementStore((state) => state.isSelected);

  if (
    readQuery.isLoading ||
    !readQuery.data ||
    (!readQuery.data.files.length && !readQuery.data.folders.length)
  ) {
    return (
      <div className={elementsContainer}>
        <div className={emptyFolderMessage}>Empty folder</div>
      </div>
    );
  }

  if (readQuery.isError) {
    return (
      <div className={elementsContainer}>
        <div className={emptyFolderMessage}>Error loading folder</div>
      </div>
    );
  }

  return (
    <div className={elementsContainer}>
      {readQuery.data.folders.map((folder) => (
        <Element
          key={folder.key}
          elementKey={folder.key}
          name={folder.name}
          type="folder"
          selected={isSelected(folder.key)}
          selecting={selecting}
        />
      ))}
      {readQuery.data.files.map((file) => (
        <Element
          key={file.key}
          elementKey={file.key}
          name={file.name}
          type="file"
          selected={isSelected(file.key)}
          selecting={selecting}
        />
      ))}
    </div>
  );
};
