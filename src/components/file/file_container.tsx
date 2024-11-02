import { useQuery } from "@tanstack/react-query";
import styles from "./file_container.module.css";
import FileItem from "./file_item";
import { fileQuery } from "@/api/query";
import { useCallback, useEffect } from "react";
import { FileType, SpecialFileName } from "@/interfaces/file";
import { ApiFileType } from "@/interfaces/api";

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

  const sortFiles = useCallback(
    (
      a: {
        fileName: string;
        type: ApiFileType;
      },
      b: {
        fileName: string;
        type: ApiFileType;
      },
    ) => {
      // Home > Trash > Others
      const specialFileOrder = [
        SpecialFileName.Root,
        SpecialFileName.Home,
        SpecialFileName.Trash,
        SpecialFileName.Upload,
      ];
      const aIndex = specialFileOrder.findIndex((name) => a.fileName === name);
      const bIndex = specialFileOrder.findIndex((name) => b.fileName === name);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) {
        return -1;
      }
      if (bIndex !== -1) {
        return 1;
      }
      // Container > Block > Link
      const typeOrder = [FileType.Container, FileType.Block, FileType.Link];
      const aTypeIndex = typeOrder.findIndex((type) => a.type === type);
      const bTypeIndex = typeOrder.findIndex((type) => b.type === type);
      return aTypeIndex - bTypeIndex;
    },
    [],
  );

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
      {readContainerQuery.data.data.sort(sortFiles).map((file) => (
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
