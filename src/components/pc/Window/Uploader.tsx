import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadButton,
  uploadForm,
  uploadInput,
  uploadLabel,
  uploadName,
  uploadTitle,
  uploader,
  uploaderContainer,
} from '../../../styles/pc/windows/uploader.css';
import { memo, useRef } from 'react';
import { useWindowStore } from '../../../store/window.store';
import { generateQueryKey } from '../../../utils/queryOptions/index.query';
import { uploadFileMutationOption } from '../../../utils/queryOptions/file.query';

export const Uploader = memo(
  ({ folderKey }: { folderKey: string }): React.ReactElement => {
    const queryClient = useQueryClient();

    const uploadFile = useMutation(uploadFileMutationOption);

    // refs
    const uploadNameRef = useRef<HTMLInputElement>(null);

    // store functions
    const closeWindow = useWindowStore((state) => state.closeWindow);

    // handlers
    const uploadFileHandler = async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();
      const files = Array.from(event.currentTarget.file.files) as File[];
      files.forEach((file) => {
        uploadFile.mutateAsync({ file, folderKey }).then(() => {
          queryClient.invalidateQueries({
            queryKey: generateQueryKey('folder', folderKey),
          });
        });
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
  }
);
