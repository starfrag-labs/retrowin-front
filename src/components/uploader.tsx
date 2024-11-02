"use client";

import { fileApi, storageApi } from "@/api/fetch";
import styles from "./uploader.module.css";

export default function Uploader() {
  const chunkSize = 1024 * 1024; // 1MB

  const uploadByChunk = async (file: File, parentKey: string) => {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const response = await fileApi.upload.writeToken(
      parentKey,
      file.name,
      file.size,
    );
    console.log(response);
    const fileKey = response.body.data.fileKey;
    const writeToken = response.body.data.token;
    const issueResponse = await storageApi.session.issue(writeToken);
    console.log(issueResponse);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);

      const result = await storageApi.file.write(fileKey, i, chunk);
      console.log(result);
    }

    await fileApi.upload.complete(fileKey, totalChunks);
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLFormElement).querySelector("input")?.files;
    const fileKey = "93138c5b-ce7d-4ec8-82de-a1c72a1e0d01";

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadByChunk(file, fileKey);
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

