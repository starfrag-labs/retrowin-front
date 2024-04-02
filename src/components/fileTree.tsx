import { ReadFolderData } from "../types/response";

export function fileTree (data: ReadFolderData) {
  return (
    <div>
      <ul>
        {data.folders.map(folder => (
          <li key={folder.folderKey}>
            {folder.folderName}
          </li>
        ))}
      </ul>
      <ul>
        {data.files.map(file => (
          <li key={file.fileKey}>
            {file.fileName}
          </li>
        ))}
      </ul>
    </div>
  )
}