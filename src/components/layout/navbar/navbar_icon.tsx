import { WindowType } from "@/interfaces/window";
import FileIcon from "../../file/file_icon";
import { FileIconType } from "@/interfaces/file";
import { useWindowStore } from "@/store/window.store";

export default function NavbarIcon({ windowType }: { windowType: WindowType }) {
  const highlightWindowsByType = useWindowStore(
    (state) => state.highlightWindowsByType,
  );

  return (
    <div className="flex-center full-size">
      <div
        className="full-size"
        onClick={() => highlightWindowsByType(windowType)}
      >
        {windowType === WindowType.Navigator && (
          <FileIcon icon={FileIconType.Container} />
        )}
        {windowType === WindowType.Image && (
          <FileIcon icon={FileIconType.Image} />
        )}
        {windowType === WindowType.Video && (
          <FileIcon icon={FileIconType.Video} />
        )}
        {windowType === WindowType.Audio && (
          <FileIcon icon={FileIconType.Block} />
        )}
        {windowType === WindowType.Uploader && (
          <FileIcon icon={FileIconType.Upload} />
        )}
      </div>
    </div>
  );
}
