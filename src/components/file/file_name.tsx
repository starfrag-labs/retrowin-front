import { useEffect, useState } from "react";
import styles from "./file_name.module.css";
import { useFileStore } from "@/store/file.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fileQuery } from "@/api/query";
import { parseSerialKey } from "@/utils/serial_key";
export default function FileName({
  name,
  fileKey,
  windowKey,
}: {
  name: string;
  fileKey: string;
  windowKey: string;
}) {
  // Query Client
  const queryClient = useQueryClient();

  // Query renaming file
  const renamingFileQuery = useMutation(fileQuery.update.name);
  // Query parent file
  const parentFileQuery = useQuery(fileQuery.read.parent(fileKey));

  // States
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  // Store state
  const renamingFileSerial = useFileStore((state) => state.renamingFileSerial);
  // Store actions
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

  // Update file name
  const updateFileName = async () => {
    const parentFileKey = parentFileQuery.data?.data.fileKey;
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
      if (
        fileKey === renamingFileKey &&
        windowKey === renamingWindowKey &&
        parentFileQuery.isFetched
      ) {
        setIsRenaming(true);
      }
    } else {
      setIsRenaming(false);
    }
  }, [fileKey, parentFileQuery.isFetched, renamingFileSerial, windowKey]);

  return (
    <div>
      {isRenaming ? (
        <form
          className={styles.file_name_form}
          onSubmit={(e) => {
            e.preventDefault();
            updateFileName();
            setIsRenaming(false);
            setRenamingFile(null);
          }}
        >
          <input
            type="text"
            className={styles.file_name_input}
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
        </form>
      ) : (
        <div className={styles.stale_text}>{name}</div>
      )}
    </div>
  );
}
