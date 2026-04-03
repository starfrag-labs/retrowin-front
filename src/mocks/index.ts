export async function startMockService() {
  if (typeof window === "undefined") {
    return;
  }

  const { worker } = await import("./browser");
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}
