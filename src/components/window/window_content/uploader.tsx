import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useCompleteUpload, useCreateFile, getUploadToken } from "@/api/generated";
import styles from "./uploader.module.css";

export default function Uploader({
  targetContainerKey,
}: {
  targetContainerKey: string;
}) {
  // Query Client
  const queryClient = useQueryClient();

  // Mutations
  const createFileMutation = useCreateFile();
  const completeUploadMutation = useCompleteUpload();

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
  const addUpload = useCallback((upload: {
    fileKey: string;
    fileName: string;
    totalSize: number;
    uploadedSize: number;
  }) => {
    setUploadState((state) => [...state, upload]);
  }, []);

  const updateUpload = useCallback((fileKey: string, uploadedSize: number) => {
    setUploadState((state) =>
      state.map((upload) =>
        upload.fileKey === fileKey ? { ...upload, uploadedSize } : upload
      )
    );
  }, []);

  const removeUpload = useCallback((fileKey: string) => {
    setUploadState((state) =>
      state.filter((upload) => upload.fileKey !== fileKey)
    );
  }, []);

  const uploadFile = async (file: File) => {
    let fileKey: string | null = null;

    try {
      // Step 1: Create file entry with type "file"
      const createResult = await createFileMutation.mutateAsync({
        data: {
          type: "file",
          fileName: file.name,
          parentKey: targetContainerKey,
        },
      });

      if (createResult.data && "file" in createResult.data) {
        fileKey = createResult.data.file.fileKey;
      }

      if (!fileKey) {
        throw new Error("Failed to create file entry");
      }

      // Add to upload state
      addUpload({
        fileKey,
        fileName: file.name,
        totalSize: file.size,
        uploadedSize: 0,
      });

      // Step 2: Get upload token (presigned URL)
      const tokenResponse = await getUploadToken(fileKey, {
        credentials: "include",
      });

      let uploadUrl: string | null = null;
      if (tokenResponse.data && "uploadToken" in tokenResponse.data) {
        uploadUrl = tokenResponse.data.uploadToken.uploadUrl;
      }

      if (!uploadUrl) {
        throw new Error("Failed to get upload token");
      }

      // Step 3: Upload file directly to S3 using presigned URL
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // Update upload state to 100%
      updateUpload(fileKey, file.size);

      // Step 4: Complete upload
      await completeUploadMutation.mutateAsync({
        fileKey,
        data: {
          byteSize: file.size,
        },
      });

      // Invalidate file query
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "file",
      });
    } finally {
      // Remove from upload state
      if (fileKey) {
        removeUpload(fileKey);
      }
    }
  };

  const uploadFiles = async (files: FileList) => {
    // Sort files by size (small to large)
    const sortedFiles = Array.from(files).sort((a, b) => a.size - b.size);

    // Upload files sequentially
    for (const file of sortedFiles) {
      await uploadFile(file);
    }
  };

  const handleUpload = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLFormElement).querySelector("input")?.files;

    if (files && files.length > 0) {
      uploadFiles(files);
    }
  }, []);

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
