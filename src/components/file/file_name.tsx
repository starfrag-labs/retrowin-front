import { memo, useEffect, useState } from "react";
import { useFileStore } from "@/store/file.store";
import { parseSerialKey } from "@/utils/serial_key";
import styles from "./file_name.module.css";

/**
 * File name component
 * @param name - name of the file
 * @param fileKey - key of the file (path in new API)
 * @param windowKey - key of the window
 * @param backgroundFile - is background file
 * @returns - File name component
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
  // States
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  // Store state
  const renamingFileSerial = useFileStore((state) => state.renamingFileSerial);
  // Store actions
  const setRenamingFile = useFileStore((state) => state.setRenamingFile);

  // Update file name (not implemented in new API yet)
  const updateFileName = async () => {
    // Rename functionality requires API support
    // For now, just close the rename UI
    setIsRenaming(false);
    setRenamingFile(null);
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
