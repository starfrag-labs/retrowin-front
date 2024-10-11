import Uploader from "@/components/uploader";
import styles from "./page.module.css";
import Downloader from "@/components/downloader";

export default function Home() {
  return (
    <div className={styles.page}>
      <Uploader />
      <Downloader />
    </div>
  );
}
