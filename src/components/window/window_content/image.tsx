import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { url } from "@/api/fetch";
import { storageQuery } from "@/api/query";
import mediaStyles from "./media.module.css";

export default function ImageViewer({
  fileKey,
  fileName,
}: {
  fileKey: string;
  fileName: string;
}) {
  // Constants
  const fileUrl = url.storage.file.read(fileKey);

  // Queries
  const sessionQuery = useQuery(storageQuery.session.read(fileKey));

  return (
    <div className={`full-size flex-center ${mediaStyles.container}`}>
      {sessionQuery.isFetched && sessionQuery.data && (
        <Image
          src={fileUrl.toString()}
          alt={fileName}
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
      )}
    </div>
  );
}
