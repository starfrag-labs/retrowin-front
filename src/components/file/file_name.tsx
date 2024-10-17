import { memo } from "react";
import styles from "./file_name.module.css";
export default memo(function FileName({ name }: { name: string }) {
  return <div className={`${styles.stale_text}`}>{name}</div>;
});
