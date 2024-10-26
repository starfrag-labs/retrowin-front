import { useQuery } from "@tanstack/react-query";
import styles from "./file_container.module.css";
import FileItem from "./file_item";
import { fileQuery } from "@/api/query";
import { useEffect } from "react";
import { FileType } from "@/interfaces/file";

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
  uploadIcon = false,
}: {
  windowKey: string;
  containerKey: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  uploadIcon?: boolean;
}) {
  const readContainerQuery = useQuery(fileQuery.read.children(containerKey));

  useEffect(() => {
    if (setLoading) {
      setLoading(readContainerQuery.isFetching);
    }
  }, [readContainerQuery.isFetching, setLoading]);

  if (readContainerQuery.isFetching || !readContainerQuery.data) {
    return null;
  }

  if (readContainerQuery.data.status !== 200) {
    return (
      <div className="flex-center full-size">
        {readContainerQuery.data.message}
      </div>
    );
  }

  return (
    <div className={`${styles.container} full-size`}>
      {uploadIcon && (
        <FileItem
          name={FileType.Upload}
          type={FileType.Upload}
          fileKey={containerKey}
          windowKey={windowKey}
        />
      )}
      {readContainerQuery.data.data.map((file) => (
        <FileItem
          key={file.fileKey}
          name={file.fileName}
          type={file.type}
          fileKey={file.fileKey}
          windowKey={windowKey}
        />
      ))}
    </div>
  );
}
