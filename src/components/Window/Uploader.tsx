import { useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '../../store/token.store';
import { uploadChunk } from '../../api/cloud';
import { uploaderContainer } from '../../styles/uploader.css';
import { useWindowStore } from '../../store/window.store';

export function Uploader({
  folderKey,
}: {
  folderKey: string;
}): React.ReactElement {
  const chunkSize = 1024 * 512;
  const queryClient = useQueryClient();

  const accessToken = useTokenStore((state) => state.accessToken);
  const closeWindow = useWindowStore((state) => state.closeWindow);


  const uploadFile = async (file: File) => {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileName = file.name.replace(/\s/g, '_');
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, (i + 1) * chunkSize);
      const chunk = file.slice(start, end);
      const result = await uploadChunk(
        accessToken,
        folderKey,
        chunk,
        fileName,
        totalChunks,
        i
      ).catch((error) => {
        console.log(fileName);
        console.error(error);
      });
      if (!result) {
        console.log('Failed to upload chunk');
        break;
      } else {
        console.log(result);
      }
    }
    queryClient.invalidateQueries({
      queryKey: ['read', 'folder', folderKey],
    });
  };

  const uploadFileHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const files = Array.from(event.currentTarget.file.files) as File[];
    files.forEach((file) => {
      uploadFile(file);
    });
    closeWindow(folderKey);
  };

  return (
    <div className={uploaderContainer}>
      <div>
        <button onClick={() => closeWindow(folderKey)}>X</button>
      </div>
      <form onSubmit={uploadFileHandler}>
        <input type="file" name="file" multiple />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
