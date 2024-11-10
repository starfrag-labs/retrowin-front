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
 * @param setLoading - set loading state
 * @param upload - show upload file
 * @param trash - show trash file
 * @param backgroundFile - is background file
 * @returns - File container component
 * @example
 * <FileContainer windowKey="421b0ad1f948" containerKey="e03431b7-6d67-4ee2-9224-e93dc04f25c4" />
 */
export default function FileContainer({
  windowKey,
  containerKey,
  setLoading,
  upload = false,
  trash = false,
  backgroundFile = false,
}: {
  windowKey: string;
  containerKey: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  upload?: boolean;
  trash?: boolean;
  backgroundFile?: boolean;
}) {
  const readContainerQuery = useQuery(fileQuery.read.children(containerKey));
  const readTrashQuery = useQuery(fileQuery.read.trash);

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

  if (readContainerQuery.isError) {
    return (
      <div className="flex-center full-size">
        {readContainerQuery.data.message}
      </div>
    );
  }

  return (
    <div className={`${styles.container} full-size`}>
      {upload && (
        <FileItem
          name={SpecialFileName.Upload}
          type={FileType.Upload}
          fileKey={containerKey}
          windowKey={windowKey}
          backgroundFile={backgroundFile}
        />
      )}
      {trash && readTrashQuery.isFetched && readTrashQuery.data && (
        <FileItem
          name={SpecialFileName.Trash}
          type={FileType.Trash}
          fileKey={readTrashQuery.data.data.fileKey || ""}
          windowKey={windowKey}
          backgroundFile={backgroundFile}
        />
      )}
      {readContainerQuery.data.data.sort(sortFiles).map((file) => (
        <FileItem
          key={file.fileKey}
          name={file.fileName}
          type={file.type}
          fileKey={file.fileKey}
          windowKey={windowKey}
          backgroundFile={backgroundFile}
        />
      ))}
    </div>
  );
}
