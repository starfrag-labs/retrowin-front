import { useGetStreamToken } from "@/api/generated";

export default function Audio({ fileKey }: { fileKey: string }) {
  // Use Orval's generated hook directly
  const streamQuery = useGetStreamToken(fileKey, {
    query: {
      select: (data) => ("streamToken" in data.data ? data.data.streamToken : null),
    },
    fetch: { credentials: "include" },
  });

  return (
    <div className={"full-size flex-center"}>
      {streamQuery.data && (
        <audio controls>
          <source src={streamQuery.data.downloadUrl} type="audio/mpeg" />
          <track kind="captions" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
