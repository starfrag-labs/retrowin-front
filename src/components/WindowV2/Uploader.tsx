import { useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '../../store/token.store';
import { uploadChunk } from '../../api/cloud';
import { useWindowStore } from '../../store/window.store';
import { uploadButton, uploadForm, uploadInput, uploadLabel, uploadName, uploadTitle, uploader, uploaderContainer } from '../../styles/windows/uploader.css';
import { memo, useRef } from 'react';

export const Uploader = memo(({
  folderKey,
}: {
  folderKey: string;
}): React.ReactElement => {
  const chunkSize = 1024 * 512;
  const queryClient = useQueryClient();

  const uploadNameRef = useRef<HTMLInputElement>(null);

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
      )
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

  const uploadNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!uploadNameRef.current) return;
    if (!event.currentTarget.files) return;
    const length = event.currentTarget.files.length;
    const text =
      length > 1 ? `${length} files` : event.currentTarget.files[0].name;
    uploadNameRef.current.value = text;
  };

  return (
    <div className={uploaderContainer}>
      <div className={uploader}>
        <div className={uploadTitle}>upload files</div>
        <form onSubmit={uploadFileHandler} className={uploadForm}>
          <div className={uploadInput}>
            <label htmlFor="file" className={uploadLabel}>
              select files
            </label>
            <input
              className={uploadName}
              placeholder="...nothing selected"
              ref={uploadNameRef}
              readOnly
            />
            <input
              type="file"
              id="file"
              multiple
              onChange={uploadNameHandler}
              style={{ display: 'none' }}
            />
          </div>
          <button type="submit" className={uploadButton}>
            upload
          </button>
        </form>
      </div>
    </div>
  );
});