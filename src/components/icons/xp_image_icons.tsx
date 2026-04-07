import Image from "next/image";

const iconMap = {
  "Folder Closed": "/icons/sprites/Folder Closed.webp",
  "Folder Opened": "/icons/sprites/Folder Opened.webp",
  "Recycle Bin (empty)": "/icons/sprites/Recycle Bin (empty).webp",
  "Recycle Bin (full)": "/icons/sprites/Recycle Bin (full).webp",
  "Generic Document": "/icons/sprites/Generic Document.webp",
  "Generic Text Document": "/icons/sprites/Generic Text Document.webp",
  "Generic Audio": "/icons/sprites/Generic Audio.webp",
  "Generic Video": "/icons/sprites/Generic Video.webp",
  "Generic Media": "/icons/sprites/Generic Media.webp",
  "My Documents": "/icons/sprites/My Documents.webp",
  "My Music": "/icons/sprites/My Music.webp",
  "My Pictures": "/icons/sprites/My Pictures.webp",
  "My Videos": "/icons/sprites/My Videos.webp",
  Bitmap: "/icons/sprites/Bitmap.webp",
  GIF: "/icons/sprites/GIF.webp",
  JPG: "/icons/sprites/JPG.webp",
  TIFF: "/icons/sprites/TIFF.webp",
  TXT: "/icons/sprites/TXT.webp",
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

  TextFile: () => (
    <Image
      src={iconMap["Generic Text Document"]}
      alt="Text File"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  Audio: () => (
    <Image
      src={iconMap["Generic Audio"]}
      alt="Audio"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  Video: () => (
    <Image
      src={iconMap["Generic Video"]}
      alt="Video"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  Media: () => (
    <Image
      src={iconMap["Generic Media"]}
      alt="Media"
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

  JPG: () => (
    <Image
      src={iconMap.JPG}
      alt="JPG"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  GIF: () => (
    <Image
      src={iconMap.GIF}
      alt="GIF"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  Bitmap: () => (
    <Image
      src={iconMap.Bitmap}
      alt="BMP"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),

  TIFF: () => (
    <Image
      src={iconMap.TIFF}
      alt="TIFF"
      width={iconSize}
      height={iconSize}
      unoptimized
    />
  ),
};
