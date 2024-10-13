import FileIcon from "./file_icon";
import FileName from "./file_name";
import styles from "./file_item.module.css";

export default function FileItem() {
  return (
    <div className={`full-size ${styles.container}`}>
      <FileIcon type="block" />
      <FileName name="test" />
    </div>
  );
}
