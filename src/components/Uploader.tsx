import { useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '../store/token.store';
import { uploadChunk } from '../api/cloud';
import { uploaderContainer } from '../styles/uploader.css';

export function Uploader({
  folderKey,
  hidden = false,
  setUploading,
}: {
  folderKey: string;
  hidden?: boolean;
  setUploading: (value: boolean) => void;
}): React.ReactElement {
  const chunkSize = 1024 * 512;
  const accessToken = useTokenStore.getState().accessToken;
  const queryClient = useQueryClient();

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
    setUploading(false);
  };
  return (
    <div className={uploaderContainer} hidden={hidden}>
      <form onSubmit={uploadFileHandler}>
        <input type="file" name="file" multiple />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
