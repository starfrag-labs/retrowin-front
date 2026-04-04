import Image from "next/image";

const iconMap = {
  "Folder Closed": "/icons/sprites/Folder Closed.webp",
  "Folder Opened": "/icons/sprites/Folder Opened.webp",
  "Recycle Bin (empty)": "/icons/sprites/Recycle Bin (empty).webp",
  "Recycle Bin (full)": "/icons/sprites/Recycle Bin (full).webp",
  "Generic Document": "/icons/sprites/Generic Document.webp",
  "My Documents": "/icons/sprites/My Documents.webp",
  Up: "/icons/sprites/Up.webp",
} as const;

const iconSize = 48;

export const XPImageIcons = {
  Folder: () => (
    <Image
      src={iconMap["Folder Closed"]}
      alt="Folder"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  FolderOpen: () => (
    <Image
      src={iconMap["Folder Opened"]}
      alt="Folder Open"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  File: () => (
    <Image
      src={iconMap["Generic Document"]}
      alt="File"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  Trash: () => (
    <Image
      src={iconMap["Recycle Bin (empty)"]}
      alt="Trash"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  TrashFull: () => (
    <Image
      src={iconMap["Recycle Bin (full)"]}
      alt="Trash Full"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  Home: () => (
    <Image
      src={iconMap["My Documents"]}
      alt="Home"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  Upload: () => (
    <Image
      src={iconMap.Up}
      alt="Upload"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),
};
