import FileContainer from "@/components/file/file_container";
import styles from "./navigator.module.css";

export default function Navigator({
  fileKey,
  windowKey,
  setLoading,
}: {
  fileKey: string;
  windowKey: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className={`flex-center full-size ${styles.container}`}>
      <div className="flex-center full-size">
        <FileContainer
          windowKey={windowKey}
          containerKey={fileKey}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
