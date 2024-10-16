import styles from "./file_container.module.css";
import FileItem from "./file_item";

/**
 * File container component
 * @param windowKey - key of the window
 * @param containerKey - key of the container
 * @returns - File container component
 * @example
 * <FileContainer windowKey="421b0ad1f948" containerKey="e03431b7-6d67-4ee2-9224-e93dc04f25c4" />
 */
export default function FileContainer({
  windowKey,
  containerKey,
  setLoading,
}: {
  windowKey: string;
  containerKey: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
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
