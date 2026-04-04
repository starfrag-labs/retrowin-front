import { forwardRef, memo } from "react";
import { FileIconType } from "@/interfaces/file";
import { XPImageIcons } from "@/components/icons/xp_image_icons";
import styles from "./file_icon.module.css";

/**
 * File icon component
 * @param icon - type of the icon
 * @param onClick - on click event
 * @param hasContent - has content (for trash/container type)
 * @param style - style of the icon
 * @returns - File icon component
 * @example
 * <FileIcon icon={FileIconType.Container} />
 */
export default memo(
  forwardRef(function FileIcon(
    {
      icon,
      onClick,
      hasContent = false,
      size = "4rem",
    }: {
      icon: FileIconType;
      onClick?: () => void;
      hasContent?: boolean;
      size?: string;
    },
    ref?: React.Ref<HTMLButtonElement>
  ) {
    return (
      <button
        className={styles.icon_container}
        ref={ref}
        onClick={onClick}
        onDragStart={(e) => e.preventDefault()}
        draggable={false}
        type="button"
        style={{
          width: size,
          height: size,
        }}
      >
        <div className={styles.image_icon}>
          {icon === FileIconType.Container &&
            (hasContent ? <XPImageIcons.Home /> : <XPImageIcons.Folder />)}
          {icon === FileIconType.Block && <XPImageIcons.File />}
          {icon === FileIconType.Home && <XPImageIcons.Home />}
          {icon === FileIconType.Trash &&
            (hasContent ? <XPImageIcons.TrashFull /> : <XPImageIcons.Trash />)}
          {icon === FileIconType.Upload && <XPImageIcons.Upload />}
          {icon === FileIconType.Image && <XPImageIcons.File />}
          {icon === FileIconType.Video && <XPImageIcons.File />}
        </div>
      </button>
    );
  })
);
