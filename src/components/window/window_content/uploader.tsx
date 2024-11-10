import styles from "./uploader.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileQuery, storageQuery } from "@/api/query";
import { useState } from "react";

export default function Uploader({
  targetContainerKey,
}: {
  targetContainerKey: string;
}) {
  const chunkSize = 1024 * 1024; // 1MB

  // State
  const [uploadState, setUploadState] = useState<
    {
      fileKey: string;
      fileName: string;
      totalSize: number;
      uploadedSize: number;
    }[]
  >([]);
  // Upload state actions
  const addUpload = (upload: {
    fileKey: string;
    fileName: string;
    totalSize: number;
    uploadedSize: number;
  }) => {
    setUploadState((state) => [...state, upload]);
  };
  const updateUpload = (fileKey: string, uploadedSize: number) => {
    setUploadState((state) =>
      state.map((upload) =>
        upload.fileKey === fileKey ? { ...upload, uploadedSize } : upload,
      ),
    );
  };
  const removeUpload = (fileKey: string) => {
    setUploadState((state) =>
      state.filter((upload) => upload.fileKey !== fileKey),
    );
  };

  // Query Client
  const queryClient = useQueryClient();

  // Mutations
  const issueWriteSessionMutation = useMutation(storageQuery.session.write);
  const writeFileMutation = useMutation(storageQuery.file.write);
  const completeUploadMutation = useMutation(fileQuery.upload.complete);

  const uploadFiles = async (files: FileList) => {
    // Sort files by size
    const sortedFiles = Array.from(files).sort((a, b) => a.size - b.size);
    // Upload files
    for (const file of sortedFiles) {
      await uploadByChunk(file).then(() => {
        // Invalidate file query
        queryClient.invalidateQueries({
          queryKey: ["file", targetContainerKey],
        });
      });
    }
  };

  const uploadByChunk = async (file: File) => {
    // Calculate total chunks
    const totalChunks = Math.ceil(file.size / chunkSize);

    // Issue write session
    const fileKey = await issueWriteSessionMutation
      .mutateAsync({
        targetContainerKey,
        fileName: file.name,
        size: file.size,
      })
      .then((response) => {
        const fileKey = response.fileKey;
        if (fileKey) {
          addUpload({
            fileKey: fileKey,
            fileName: file.name,
            totalSize: file.size,
            uploadedSize: 0,
          });
        }
        return fileKey;
      });

    if (fileKey) {
      // Upload chunks
      for (let i = 0; i < totalChunks; i++) {
        // Calculate chunk start and end
        const start = i * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = file.slice(start, end);
        // Write chunk to storage
        await writeFileMutation
          .mutateAsync({
            fileKey,
            chunkCount: i,
            fileData: chunk,
          })
          .then(() => {
            // Update upload state
            updateUpload(fileKey, end);
          })
      }

      // Complete upload
      await completeUploadMutation
        .mutateAsync({
          fileKey,
          totalChunks,
        })
        .finally(() => {
          // Remove upload state
          removeUpload(fileKey);
        });
    }
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLFormElement).querySelector("input")?.files;

    if (files) {
      uploadFiles(files);
    }
  };

  return (
    <div className={`${styles.container} full-size`}>
      <div className={`full-size`}>
        <div className={`${styles.upload_state} full-size`}>
          {uploadState.map((upload) => (
            <div key={upload.fileKey} className={styles.progress_container}>
              <span>{upload.fileName}</span>
              <progress
                value={upload.uploadedSize}
                max={upload.totalSize}
              ></progress>
              <div>
                {Math.round((upload.uploadedSize / upload.totalSize) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
      <form className={styles.form} onSubmit={handleUpload}>
        <input type="file" className={styles.input} multiple />
        <button type="submit" className={styles.button}>
          Upload
        </button>
      </form>
    </div>
  );
}
