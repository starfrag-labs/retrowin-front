import { useCallback, useEffect } from "react";
import { useGetFileChildren, useGetTrashContainer } from "@/api/generated";
import type { ApiFileType } from "@/interfaces/api";
import { FileType, SpecialFileName } from "@/interfaces/file";
import styles from "./file_container.module.css";
import FileItem from "./file_item";

// Convert new API FileType to legacy ApiFileType
const convertFileType = (type: "container" | "file"): ApiFileType => {
  return type === "container" ? FileType.Container : FileType.Block;
};

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
  // Use Orval's generated hooks directly
  const readContainerQuery = useGetFileChildren(containerKey, {
    query: {
      select: (data) => ("files" in data.data ? data.data.files : []),
    },
    fetch: { credentials: "include" },
  });
  const readTrashQuery = useGetTrashContainer({
    query: {
      select: (data) => ("file" in data.data ? data.data.file : null),
    },
    fetch: { credentials: "include" },
  });

  const sortFiles = useCallback(
    (
      a: { fileName: string; type: "container" | "file" },
      b: { fileName: string; type: "container" | "file" }
    ) => {
      // Home > Trash > Others
      const specialFileOrder = [
        SpecialFileName.Root,
        SpecialFileName.Home,
        SpecialFileName.Trash,
        SpecialFileName.Upload,
      ] as string[];
      const aIndex = specialFileOrder.indexOf(a.fileName);
      const bIndex = specialFileOrder.indexOf(b.fileName);
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
      const aTypeIndex = typeOrder.indexOf(convertFileType(a.type));
      const bTypeIndex = typeOrder.indexOf(convertFileType(b.type));
      return aTypeIndex - bTypeIndex;
    },
    []
  );

  useEffect(() => {
    if (setLoading) {
      // Set loading state
      setLoading(readContainerQuery.isFetching);
    }
  }, [readContainerQuery.isFetching, setLoading]);

  if (readContainerQuery.isError && readContainerQuery.error) {
    return (
      <div className="flex-center full-size">
        {(readContainerQuery.error as any)?.message || "Error loading files"}
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
      {trash && readTrashQuery.isSuccess && readTrashQuery.data && (
        <FileItem
          name={SpecialFileName.Trash}
          type={FileType.Trash}
          fileKey={readTrashQuery.data.fileKey}
          windowKey={windowKey}
          backgroundFile={backgroundFile}
        />
      )}
      {readContainerQuery.data?.sort(sortFiles).map((file) => (
        <FileItem
          key={file.fileKey}
          name={file.fileName}
          type={convertFileType(file.type)}
          fileKey={file.fileKey}
          windowKey={windowKey}
          backgroundFile={backgroundFile}
        />
      ))}
    </div>
  );
}
