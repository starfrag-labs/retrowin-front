import { useCallback, useEffect } from "react";
import { useLs, useStatPath } from "@/api/generated";
import type { DirEntry } from "@/api/generated/model";
import { FileType, SpecialFileName } from "@/interfaces/file";
import styles from "./file_container.module.css";
import FileItem from "./file_item";

/**
 * Convert file type from mode to FileType
 */
const getFileType = (fileType: number): FileType => {
  // Check if directory (S_IFDIR = 0o040000)
  if ((fileType & 0o040000) === 0o040000) {
    return FileType.Container;
  }
  // Check if symlink (S_IFLNK = 0o0120000)
  if ((fileType & 0o0120000) === 0o0120000) {
    return FileType.Link;
  }
  return FileType.Block;
};

/**
 * Check if path is trash directory
 */
const _isTrashPath = (path: string): boolean => {
  return path === "/.trash" || path.endsWith("/.trash");
};

/**
 * Check if path is upload directory
 */
const _isUploadPath = (path: string): boolean => {
  return path === "/.upload" || path.endsWith("/.upload");
};

/**
 * File container component
 * @param windowKey - key of the window
 * @param systemId - system ID
 * @param path - current directory path
 * @param setLoading - set loading state
 * @param upload - show upload file
 * @param trash - show trash file
 * @param backgroundFile - is background file
 * @returns - File container component
 * @example
 * <FileContainer windowKey="421b0ad1f948" systemId="sys-123" path="/home/user" />
 */
export default function FileContainer({
  windowKey,
  systemId,
  path,
  setLoading,
  upload = false,
  trash = false,
  backgroundFile = false,
}: {
  windowKey: string;
  systemId: string;
  path: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  upload?: boolean;
  trash?: boolean;
  backgroundFile?: boolean;
}) {
  // Use Orval's generated hooks directly
  const readDirQuery = useLs(
    systemId,
    { path },
    {
      query: {
        select: (data) => (data.status === 200 ? data.data.entries : []),
        enabled: !!systemId && !!path,
      },
      fetch: { credentials: "include" },
    }
  );

  // Get trash inode if trash should be shown
  const trashPath = path === "/" ? "/.trash" : `${path}/.trash`;
  const trashStatQuery = useStatPath(
    systemId,
    { path: trashPath },
    {
      query: {
        select: (data) => (data.status === 200 ? data.data.inode : null),
        enabled: trash && !!systemId,
      },
      fetch: { credentials: "include" },
    }
  );

  const sortFiles = useCallback(
    (a: DirEntry, b: DirEntry): number => {
      // Home > Trash > Upload > Others
      const specialFileOrder = [
        SpecialFileName.Root,
        SpecialFileName.Home,
        SpecialFileName.Trash,
        SpecialFileName.Upload,
      ] as string[];

      // Skip hidden files starting with dot
      if (a.name.startsWith(".")) return 1;
      if (b.name.startsWith(".")) return -1;

      const aIndex = specialFileOrder.indexOf(a.name);
      const bIndex = specialFileOrder.indexOf(b.name);
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
      const aTypeIndex = typeOrder.indexOf(getFileType(a.fileType));
      const bTypeIndex = typeOrder.indexOf(getFileType(b.fileType));
      return aTypeIndex - bTypeIndex;
    },
    []
  );

  useEffect(() => {
    if (setLoading) {
      // Set loading state
      setLoading(readDirQuery.isFetching);
    }
  }, [readDirQuery.isFetching, setLoading]);

  if (readDirQuery.isError && readDirQuery.error) {
    return (
      <div className="flex-center full-size">
        {"message" in readDirQuery.error ? readDirQuery.error.message : "Error loading files"}
      </div>
    );
  }

  return (
    <div className={`${styles.container} full-size`}>
      {upload && (
        <FileItem
          name={SpecialFileName.Upload}
          type={FileType.Upload}
          fileKey={path}
          windowKey={windowKey}
          systemId={systemId}
          backgroundFile={backgroundFile}
        />
      )}
      {trash && trashStatQuery.isSuccess && trashStatQuery.data && (
        <FileItem
          name={SpecialFileName.Trash}
          type={FileType.Trash}
          fileKey={trashPath}
          windowKey={windowKey}
          systemId={systemId}
          backgroundFile={backgroundFile}
        />
      )}
      {readDirQuery.data
        ?.filter((entry: DirEntry) => !entry.name.startsWith("."))
        .sort(sortFiles)
        .map((file: DirEntry) => (
          <FileItem
            key={file.inodeId}
            name={file.name}
            type={getFileType(file.fileType)}
            fileKey={`${path === "/" ? "" : path}/${file.name}`}
            windowKey={windowKey}
            systemId={systemId}
            backgroundFile={backgroundFile}
          />
        ))}
    </div>
  );
}
