import { FaFileAlt } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import styles from "./file_icon.module.css";
import { memo } from "react";

export default memo(function FileIcon({
  type = "block",
}: {
  type: "block" | "container" | "upload";
}) {
  if (type === "container") {
    return <FaFolder className={`${styles.icon} ${styles.folder_icon}`} />;
  }
  if (type === "block") {
    return <FaFileAlt className={`${styles.icon} ${styles.file_icon}`} />;
  }
});
