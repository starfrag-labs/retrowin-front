import Uploader from "@/components/uploader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Uploader />
    </div>
  );
}
