import { memo, useEffect, useState } from "react";
import styles from "./file_name.module.css";
import { useFileStore } from "@/store/file.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileQuery } from "@/api/query";
import { parseSerialKey } from "@/utils/serial_key";

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
  const renamingFileQuery = useMutation(fileQuery.update.name);

  // States
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  // Store state
  const renamingFileSerial = useFileStore((state) => state.renamingFileSerial);
  // Store actions
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

  // Update file name
  const updateFileName = async () => {
    const parentFileKey = await queryClient
      .fetchQuery(fileQuery.read.parent(fileKey))
      .then((data) => data.data.fileKey);
    if (!parentFileKey) return;
    await renamingFileQuery
      .mutateAsync({
        fileKey,
        fileName: newName,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["file", fileKey],
        });
        queryClient.invalidateQueries({
          queryKey: ["file", parentFileKey],
        });
      });
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
            autoFocus
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
