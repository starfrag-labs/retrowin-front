import { AppWindow, WindowType } from "@/interfaces/window";
import styles from "./navbar_container.module.css";
import FileIcon from "../../file/file_icon";
import { FileIconType } from "@/interfaces/file";
import { useEffect, useMemo, useState } from "react";
export default function Navbar({ windows }: { windows: AppWindow[] }) {
  const defaultIcons = useMemo(
    () => [
      { type: WindowType.Navigator, count: 0, fixed: false },
      { type: WindowType.Image, count: 0, fixed: false },
      { type: WindowType.Video, count: 0, fixed: false },
      { type: WindowType.Audio, count: 0, fixed: false },
      { type: WindowType.Uploader, count: 0, fixed: false },
    ],
    [],
  );

  const [icons, setIcons] =
    useState<{ type: WindowType; count: number; fixed: boolean }[]>(
      defaultIcons,
    );

  useEffect(() => {
    const newIcons = defaultIcons.map((icon) => {
      const count = windows.filter(
        (window) => window.type === icon.type,
      ).length;
      return { ...icon, count };
    });
    setIcons(newIcons);
  }, [defaultIcons, windows]);

  return (
    <nav className={styles.container}>
      {icons.map((icon, index) => (
        <div key={index} className={styles.icon_container}>
          {(icon.fixed || icon.count > 0) && (
            <div className="full-size">
              {icon.type === WindowType.Navigator && (
                <FileIcon icon={FileIconType.Container} />
              )}
              {icon.type === WindowType.Image && (
                <FileIcon icon={FileIconType.Block} />
              )}
              {icon.type === WindowType.Video && (
                <FileIcon icon={FileIconType.Block} />
              )}
              {icon.type === WindowType.Audio && (
                <FileIcon icon={FileIconType.Block} />
              )}
              {icon.type === WindowType.Uploader && (
                <FileIcon icon={FileIconType.Upload} />
              )}
              <div className={styles.count}>{icon.count}</div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
