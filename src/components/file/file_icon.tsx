import { FaFileAlt } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import styles from "./file_icon.module.css";
import { CSSProperties, forwardRef, memo } from "react";
import { FileIconType } from "@/interfaces/file";

export default memo(
  forwardRef(function FileIcon(
    {
      icon,
      onClick,
      style,
    }: {
      icon: FileIconType;
      onClick?: () => void;
      style?: CSSProperties;
    },
    ref?: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div className={styles.icon_container} ref={ref} onDoubleClick={onClick}>
        {icon === FileIconType.Container && (
          <FaFolder
            className={`${styles.icon}`}
            style={{
              color: "#ffa400",
              ...style,
            }}
          />
        )}
        {icon === FileIconType.Block && (
          <FaFileAlt
            className={`${styles.icon}`}
            style={{
              color: "#999999",
              ...style,
            }}
          />
        )}
        {icon === FileIconType.Home && (
          <FaHome
            className={`${styles.icon}`}
            style={{
              color: "#90b75e",
              ...style,
            }}
          />
        )}
        {icon === FileIconType.Trash && (
          <FaTrash
            className={`${styles.icon}`}
            style={{
              color: "#677381",
              padding: "0.25rem",
              ...style,
            }}
          />
        )}
        {icon === FileIconType.Upload && (
          <FaUpload
            className={`${styles.icon}`}
            style={{
              color: "#9296f0",
              padding: "0.25rem",
              ...style,
            }}
          />
        )}
      </div>
    );
  }),
);
