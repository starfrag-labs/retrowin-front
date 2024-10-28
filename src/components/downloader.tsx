"use client";

import { fileApi, storageApi, url } from "@/api/fetch";
import styles from "./uploader.module.css";

export default function Downloader() {
  const downloadFile = async (fileKey: string) => {
    const response = await fileApi.stream.readToken(fileKey);
    const readToken = response.body.data.token;
    await storageApi.session.issue(readToken);

    const fileUrl = url.storage.file.src(fileKey);

    const iframe = document.getElementById("downloader") as HTMLIFrameElement;
    iframe.src = fileUrl.toString();
  };

  const handleDownload = () => {
    const fileKey = "f03c6f79-37fc-4a82-ba91-b1002612d5e7";
    downloadFile(fileKey);
  };
  return (
    <div className={styles.container}>
      <iframe id="downloader" style={{ display: "none" }} />
      <button className={styles.button} onClick={handleDownload}>
        Download
      </button>
    </div>
  );
}
