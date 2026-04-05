import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// Ensure worker starts only once
let workerStarted = false;

export async function startWorker() {
  if (workerStarted) {
    return;
  }
  workerStarted = true;
  await worker.start({
    onUnhandledRequest: "bypass",
  });
}
