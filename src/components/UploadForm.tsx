import { useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '../store/token.store';
import { uploadChunk } from '../utils/api/cloud';

export function UploadForm({
  folderKey,
}: {
  folderKey: string;
}): React.ReactElement {
  const chunkSize = 1024 * 512;
  const accessToken = useTokenStore.getState().accessToken;
  const queryClient = useQueryClient();
  const uploadFileHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get('file') as File;
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
  return (
    <div>
      <form onSubmit={uploadFileHandler}>
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
