import FileContainer from "@/components/file/file_container";
import { useWindowStore } from "@/store/window.store";
import styles from "./navigator.module.css";

export default function Navigator({
  path,
  windowKey,
  setLoading,
}: {
  path: string;
  windowKey: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // Get system ID from window store
  const windows = useWindowStore((state) => state.windows);
  const currentWindow = windows.find((w) => w.key === windowKey);
  const systemId = currentWindow?.systemId || "";

  return (
    <div className={`flex-center full-size ${styles.container}`}>
      <div className="flex-center full-size">
        <FileContainer
          windowKey={windowKey}
          systemId={systemId}
          path={path}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
