import styles from "./file_container.module.css";
import FileItem from "./file_item";
export default function FileContainer({
  windowKey,
  containerKey,
}: {
  windowKey: string;
  containerKey: string;
}) {
  const file_count = 25;
  return (
    <div className={`${styles.container} full-size`}>
      {Array.from({ length: file_count }).map((_, index) => (
        <FileItem
          key={index}
          name="name"
          type="container"
          fileKey={index.toString()}
          windowKey={windowKey}
        />
      ))}
    </div>
  );
}
