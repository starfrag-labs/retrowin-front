import { useGetDownloadUrl } from "@/api/generated";
import { useWindowStore } from "@/store/window.store";

export default function Audio({ fileKey: path }: { fileKey: string }) {
  // Get system ID from window store
  const windows = useWindowStore((state) => state.windows);
  const currentWindow = windows.find((w) => w.targetKey === path);
  const systemId = currentWindow?.systemId || "";

  // Use Orval's generated hook directly
  const downloadQuery = useGetDownloadUrl(
    systemId,
    { path },
    {
      query: {
        select: (data: any) => (data.status === 200 ? data.data.downloadUrl : null),
      },
      fetch: { credentials: "include" },
    }
  );

  return (
    <div className={"full-size flex-center"}>
      {downloadQuery.data && (
        <audio controls>
          <source src={downloadQuery.data.downloadUrl} type="audio/mpeg" />
          <track kind="captions" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
