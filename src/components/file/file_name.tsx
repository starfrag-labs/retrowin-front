import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";
import { useUpdateFile, useGetFileInfo } from "@/api/generated";
import { getFileInfo } from "@/api/generated";
import { useFileStore } from "@/store/file.store";
import { parseSerialKey } from "@/utils/serial_key";
import styles from "./file_name.module.css";

/**
 * File name component
 * @param name - name of the file
 * @param fileKey - key of the file
 * @param windowKey - key of the window
 * @param backgroundFile - is background file
 * @returns - File name component
 * @example
 * <FileName name="example.txt" fileKey="e03431b7-6d67-4ee2-9224-e93dc04f25c4" windowKey="421b0ad1f948" />
 */
export default memo(function FileName({
  name,
  fileKey,
  windowKey,
  backgroundFile = false,
}: {
  name: string;
  fileKey: string;
  windowKey: string;
  backgroundFile?: boolean;
}) {
  // Query Client
  const queryClient = useQueryClient();

  // Query renaming file
  const renamingFileQuery = useUpdateFile();

  // States
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  // Store state
  const renamingFileSerial = useFileStore((state) => state.renamingFileSerial);
  // Store actions
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

  // Update file name
  const updateFileName = async () => {
    // Get parent file info to find parent key
    const fileInfo = await getFileInfo(fileKey, { credentials: "include" });
    if (fileInfo.data && "file" in fileInfo.data && fileInfo.data.file.parentId) {
      const parentFileKey = fileInfo.data.file.parentId.toString();
      await renamingFileQuery
        .mutateAsync({
          fileKey,
          data: { fileName: newName },
        })
        .then(() => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === "file",
          });
        });
    }
  };

  // Set isRenaming state when the file is the renaming file
  useEffect(() => {
    if (renamingFileSerial) {
      const { fileKey: renamingFileKey, windowKey: renamingWindowKey } =
        parseSerialKey(renamingFileSerial);
      if (fileKey === renamingFileKey && windowKey === renamingWindowKey) {
        setIsRenaming(true);
      }
    } else {
      setIsRenaming(false);
    }
  }, [fileKey, renamingFileSerial, windowKey]);

  return (
    <div className={`flex-center full-size`}>
      {isRenaming ? (
        <form
          className={styles.rename_form}
          onSubmit={(e) => {
            e.preventDefault();
            updateFileName();
            setIsRenaming(false);
            setRenamingFile(null);
          }}
        >
          <input
            type="text"
            className={styles.rename_input}
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            onBlur={() => {
              setIsRenaming(false);
              setRenamingFile(null);
            }}
          />
        </form>
      ) : (
        <div className={styles.stale_container}>
          <div
            className={`${styles.name_text} ${backgroundFile && styles.background_file_name}`}
          >
            {name}
          </div>
        </div>
      )}
    </div>
  );
});
