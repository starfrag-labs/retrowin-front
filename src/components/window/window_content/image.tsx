import { useGetStreamToken } from "@/api/generated";
import Image from "next/image";
import mediaStyles from "./media.module.css";

export default function ImageViewer({
  fileKey,
  fileName,
}: {
  fileKey: string;
  fileName: string;
}) {
  // Use Orval's generated hook directly
  const streamQuery = useGetStreamToken(fileKey, {
    query: {
      select: (data) => ("streamToken" in data.data ? data.data.streamToken : null),
    },
    fetch: { credentials: "include" },
  });

  return (
    <div className={`full-size flex-center ${mediaStyles.container}`}>
      {streamQuery.data && (
        <Image
          src={streamQuery.data.downloadUrl}
          alt={fileName}
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
      )}
    </div>
  );
}
