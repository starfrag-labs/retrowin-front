import styles from "./uploader.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileQuery, storageQuery } from "@/api/query";

export default function Uploader({
  targetContainerKey,
}: {
  targetContainerKey: string;
}) {
  const chunkSize = 1024 * 1024; // 1MB

  // Query Client
  const queryClient = useQueryClient();

  // Mutations
  const issueWriteSessionQuery = useMutation(storageQuery.session.write);
  const writeFileQuery = useMutation(storageQuery.file.write);
  const completeUploadQuery = useMutation(fileQuery.upload.complete);

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
    const response = await issueWriteSessionQuery.mutateAsync({
      targetContainerKey,
      fileName: file.name,
      size: file.size,
    });
    const fileKey = response.fileKey;

    // Upload chunks
    for (let i = 0; i < totalChunks; i++) {
      // Calculate chunk start and end
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);
      // Write chunk to storage
      await writeFileQuery.mutateAsync({
        fileKey,
        chunkCount: i,
        fileData: chunk,
      });
    }

    // Complete upload
    await completeUploadQuery.mutateAsync({
      fileKey,
      totalChunks,
    });
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLFormElement).querySelector("input")?.files;

    if (files) {
      uploadFiles(files);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleUpload}>
        <input type="file" className={styles.input} multiple />
        <button type="submit" className={styles.button}>
          Upload
        </button>
      </form>
    </div>
  );
}
