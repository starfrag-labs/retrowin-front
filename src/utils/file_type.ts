import type { FileType } from "@/types/file";
import { BackendFileType, FileIconType, VirtualFileType } from "@/types/file";
import { WindowType } from "@/types/window";
import { ContentTypes, getContentTypes } from "@/utils/content_type";

/**
 * Convert API d_type number to FileType
 */
export function getFileType(dType: number): FileType {
  switch (dType) {
    case 4: // DT_DIR
      return BackendFileType.Directory;
    case 10: // DT_LNK
      return BackendFileType.Symlink;
    case 3: // DT_OBJ
      return BackendFileType.Object;
    default:
      return BackendFileType.Regular;
  }
}

/**
 * Get icon type for a file based on its FileType and optional filename
 */
export function getIconType(
  fileType: FileType,
  fileName?: string
): FileIconType {
  switch (fileType) {
    case BackendFileType.Directory:
      return FileIconType.Directory;
    case BackendFileType.Symlink:
      return FileIconType.Regular;
    case BackendFileType.Object:
      if (fileName) {
        const contentType = getContentTypes(fileName);
        switch (contentType) {
          case ContentTypes.Image:
            return FileIconType.Image;
          case ContentTypes.Video:
            return FileIconType.Video;
          case ContentTypes.Audio:
            return FileIconType.Audio;
        }
      }
      return FileIconType.Object;
    case BackendFileType.Regular:
      return FileIconType.Regular;
    case VirtualFileType.Home:
      return FileIconType.Home;
    case VirtualFileType.Trash:
      return FileIconType.Trash;
    case VirtualFileType.Upload:
      return FileIconType.Upload;
    case VirtualFileType.Root:
      return FileIconType.Directory;
  }
}

/**
 * Determine which WindowType to open for a given file.
 * Returns null if the file type has no window (e.g., Regular, Symlink).
 */
export function getWindowType(
  fileType: FileType,
  fileName: string
): WindowType | null {
  switch (fileType) {
    case BackendFileType.Directory:
    case VirtualFileType.Root:
    case VirtualFileType.Home:
      return WindowType.Navigator;
    case BackendFileType.Object: {
      const contentType = getContentTypes(fileName);
      switch (contentType) {
        case ContentTypes.Image:
          return WindowType.Image;
        case ContentTypes.Video:
          return WindowType.Video;
        case ContentTypes.Audio:
          return WindowType.Audio;
        default:
          return null;
      }
    }
    case VirtualFileType.Upload:
      return WindowType.Uploader;
    case VirtualFileType.Trash:
      return WindowType.Trash;
    default:
      return null;
  }
}

/**
 * Check if a file type can be a drag-and-drop target (files can be moved into it)
 */
export function isDragTarget(fileType: FileType): boolean {
  return (
    fileType === BackendFileType.Directory ||
    fileType === VirtualFileType.Root ||
    fileType === VirtualFileType.Home ||
    fileType === VirtualFileType.Trash
  );
}

/**
 * Check if a file type can be selected via the selection box
 */
export function isSelectable(fileType: FileType): boolean {
  return (
    fileType === BackendFileType.Directory ||
    fileType === BackendFileType.Object ||
    fileType === BackendFileType.Regular ||
    fileType === BackendFileType.Symlink
  );
}

/**
 * Get sort order for file types in directory listing.
 * Lower values appear first.
 */
export function getFileTypeSortOrder(fileType: FileType): number {
  switch (fileType) {
    case BackendFileType.Directory:
      return 0;
    case BackendFileType.Object:
      return 1;
    case BackendFileType.Regular:
      return 2;
    case BackendFileType.Symlink:
      return 3;
    default:
      return 4;
  }
}
