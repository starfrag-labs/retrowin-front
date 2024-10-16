import { FaFileAlt } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import styles from "./file_icon.module.css";
import { forwardRef, memo } from "react";

export default memo(
  forwardRef(function FileIcon(
    {
      type = "block",
      onClick,
    }: {
      type: "block" | "container" | "upload";
      onClick?: () => void;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    if (type === "container") {
      return (
        <div className={styles.icon_container} ref={ref} onClick={onClick}>
          <FaFolder className={`${styles.icon} ${styles.folder_icon}`} />
        </div>
      );
    }
    if (type === "block") {
      return (
        <div className={styles.icon_container} ref={ref} onClick={onClick}>
          <FaFileAlt className={`${styles.icon} ${styles.file_icon}`} />
        </div>
      );
    }
  }),
);
