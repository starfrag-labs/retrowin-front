import { FaRegFileAlt } from "react-icons/fa";
import { FaRegFolder } from "react-icons/fa";
import styles from "./file_icon.module.css";

export default function FileIcon({
  type = "block",
}: {
  type: "block" | "container";
}) {
  if (type === "block") {
    return <FaRegFolder />;
  }
  if (type === "container") {
    return <FaRegFileAlt className={styles.icon} />;
  }
}
