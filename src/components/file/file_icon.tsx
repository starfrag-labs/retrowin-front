import { FaFileAlt } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import styles from "./file_icon.module.css";
import { forwardRef, memo } from "react";
import { ApiFileType, FileType } from "@/interfaces/api";

export default memo(
  forwardRef(function FileIcon(
    {
      type = "upload",
      onClick,
    }: {
      type: FileType;
      onClick?: () => void;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    if (type === ApiFileType.Container) {
      return (
        <div className={styles.icon_container} ref={ref} onClick={onClick}>
          <FaFolder className={`${styles.icon} ${styles.folder_icon}`} />
        </div>
      );
    }
    if (type === ApiFileType.Block) {
      return (
        <div className={styles.icon_container} ref={ref} onClick={onClick}>
          <FaFileAlt className={`${styles.icon} ${styles.file_icon}`} />
        </div>
      );
    }
  }),
);
