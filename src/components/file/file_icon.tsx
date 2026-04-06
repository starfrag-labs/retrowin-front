import { forwardRef, memo } from "react";
import { XPImageIcons } from "@/components/icons/xp_image_icons";
import { FileIconType } from "@/interfaces/file";
import styles from "./file_icon.module.css";

/**
 * File icon component
 * @param icon - type of the icon
 * @param onClick - on click event
 * @param hasContent - has content (for trash/container type)
 * @param asButton - render as button element (default: true)
 * @param size - style of the icon
 * @returns - File icon component
 * @example
 * <FileIcon icon={FileIconType.Directory} />
 */
export default memo(
  forwardRef(function FileIcon(
    {
      icon,
      onClick,
      onDoubleClick,
      hasContent = false,
      asButton = true,
      size = "4rem",
    }: {
      icon: FileIconType;
      onClick?: () => void;
      onDoubleClick?: () => void;
      hasContent?: boolean;
      asButton?: boolean;
      size?: string;
    },
    ref?: React.Ref<HTMLButtonElement | HTMLDivElement>
  ) {
    const Wrapper = asButton ? "button" : "div";
    const wrapperProps = asButton
      ? {
          type: "button" as const,
          onClick,
          onDoubleClick,
          onDragStart: (e: React.DragEvent) => e.preventDefault(),
          draggable: false as const,
        }
      : {
          onClick,
          onDoubleClick,
          onDragStart: (e: React.DragEvent) => e.preventDefault(),
          draggable: false as const,
        };

    return (
      <Wrapper
        className={styles.icon_container}
        ref={ref as React.Ref<HTMLButtonElement> & React.Ref<HTMLDivElement>}
        style={{
          width: size,
          height: size,
        }}
        {...wrapperProps}
      >
        <div className={styles.image_icon}>
          {icon === FileIconType.Directory &&
            (hasContent ? <XPImageIcons.Home /> : <XPImageIcons.Folder />)}
          {icon === FileIconType.Regular && <XPImageIcons.File />}
          {icon === FileIconType.Object && <XPImageIcons.File />}
          {icon === FileIconType.Home && <XPImageIcons.Home />}
          {icon === FileIconType.Trash &&
            (hasContent ? <XPImageIcons.TrashFull /> : <XPImageIcons.Trash />)}
          {icon === FileIconType.Upload && <XPImageIcons.Upload />}
          {icon === FileIconType.Image && <XPImageIcons.File />}
          {icon === FileIconType.Video && <XPImageIcons.File />}
        </div>
      </Wrapper>
    );
  })
);
