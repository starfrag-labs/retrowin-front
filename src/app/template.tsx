"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";

const queryClient = new QueryClient();

export default function Template({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@/mocks")
        .then(({ startMockService }) => startMockService())
        .then(() => setMswReady(true))
        .catch((err) => {
          console.error("Failed to start MSW:", err);
          setMswReady(true);
        });
    } else {
      setMswReady(true);
    }
  }, []);

  if (!mswReady && process.env.NODE_ENV === "development") {
    return <div className="flex-center full-size">Loading Mock API...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </QueryClientProvider>
  );
}
