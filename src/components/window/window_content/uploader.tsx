import { fileApi, storageApi } from "@/api/fetch";
import styles from "./uploader.module.css";

export default function Uploader({
  targetContainerKey,
  setLoading,
}: {
  targetContainerKey: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const chunkSize = 1024 * 1024; // 1MB

  const uploadByChunk = async (file: File) => {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const response = await fileApi.upload.writeToken(
      targetContainerKey,
      file.name,
      file.size,
    );
    const fileKey = response.body.data.fileKey;
    const writeToken = response.body.data.token;
    await storageApi.session.issue(writeToken);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);

      await storageApi.file.write(fileKey, i, chunk);
    }

    await fileApi.upload.complete(fileKey, totalChunks);
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLFormElement).querySelector("input")?.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadByChunk(file);
      }
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
