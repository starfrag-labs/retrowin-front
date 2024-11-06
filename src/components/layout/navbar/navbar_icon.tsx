import { WindowType } from "@/interfaces/window";
import FileIcon from "../../file/file_icon";
import { FileIconType } from "@/interfaces/file";
import { useWindowStore } from "@/store/window.store";
import styles from "./navbar_icon.module.css";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fileQuery } from "@/api/query";

export default function NavbarIcon({
  windowType,
  windowCount,
}: {
  windowType: WindowType;
  windowCount: number;
}) {
  // Icon size
  // 5px is the border height and margin
  const size = "calc(100% - 5px)";

  // Store actions
  const highlightWindowsByType = useWindowStore(
    (state) => state.highlightWindowsByType,
  );
  const newWindow = useWindowStore((state) => state.newWindow);

  // Queries
  const homeKeyQuery = useQuery(fileQuery.read.home);
  const trashKeyQuery = useQuery(fileQuery.read.trash);

  const handleClick = useCallback(() => {
    switch (windowType) {
      case WindowType.Uploader:
        if (windowCount === 0 && homeKeyQuery.isSuccess && homeKeyQuery.data) {
          newWindow({
            targetKey: homeKeyQuery.data.data.fileKey,
            type: WindowType.Uploader,
            title: "Uploader",
          });
        }
        break;
      case WindowType.Trash:
        if (
          windowCount === 0 &&
          trashKeyQuery.isSuccess &&
          trashKeyQuery.data
        ) {
          newWindow({
            targetKey: trashKeyQuery.data.data.fileKey,
            type: WindowType.Trash,
            title: "Trash",
          });
        }
        break;
    }
    // Highlight windows
    highlightWindowsByType(windowType);
  }, [
    highlightWindowsByType,
    homeKeyQuery.data,
    homeKeyQuery.isSuccess,
    newWindow,
    trashKeyQuery.data,
    trashKeyQuery.isSuccess,
    windowCount,
    windowType,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.icon_container} onClick={handleClick}>
        {windowCount > 0 && <div className={styles.icon_highlight} />}
        {windowType === WindowType.Navigator && (
          <FileIcon icon={FileIconType.Container} size={size} />
        )}
        {windowType === WindowType.Image && (
          <FileIcon icon={FileIconType.Image} size={size} />
        )}
        {windowType === WindowType.Video && (
          <FileIcon icon={FileIconType.Video} size={size} />
        )}
        {windowType === WindowType.Audio && (
          <FileIcon icon={FileIconType.Block} size={size} />
        )}
        {windowType === WindowType.Uploader && (
          <FileIcon icon={FileIconType.Upload} size={size} />
        )}
        {windowType === WindowType.Trash && (
          <FileIcon icon={FileIconType.Trash} size={size} />
        )}
        {windowType === WindowType.Document && (
          <FileIcon icon={FileIconType.Block} size={size} />
        )}
      </div>
    </div>
  );
}
