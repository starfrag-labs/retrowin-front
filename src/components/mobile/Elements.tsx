import { ReadFolderData } from '../../types/response';
import { Element } from './Element';

export const Elements = ({ data }: { data: ReadFolderData }) => {
  return (
    <div>
      {data.folders.map((folder) => (
        <Element
          key={folder.key}
          elementKey={folder.key}
          type="folder"
          name={folder.name}
        />
      ))}
      {data.files.map((file) => (
        <Element
          key={file.key}
          elementKey={file.key}
          type="file"
          name={file.name}
        />
      ))}
    </div>
  );
};
