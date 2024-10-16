import FileContainer from "@/components/file/file_container";

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
    <div className="flex-center full-size">
      <div className="flex-center full-size">
        <FileContainer windowKey={windowKey} containerKey={fileKey} />
      </div>
    </div>
  );
}
