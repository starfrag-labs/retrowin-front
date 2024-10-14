import { FaFileAlt } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import styles from "./file_icon.module.css";
import { forwardRef, memo } from "react";

export default memo(
  forwardRef(function FileIcon(
    {
      type = "block",
    }: {
      type: "block" | "container" | "upload";
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    if (type === "container") {
      return (
        <div className={styles.icon_container} ref={ref}>
          <FaFolder className={`${styles.icon} ${styles.folder_icon}`} />
        </div>
      );
    }
    if (type === "block") {
      return (
        <div className={styles.icon_container} ref={ref}>
          <FaFileAlt className={`${styles.icon} ${styles.file_icon}`} />
        </div>
      );
    }
  }),
);
