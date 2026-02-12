import { exec } from "../util/exec.js";
import * as log from "../util/log.js";

export function enable(): void {
  log.heading("Entire...");

  const status = exec("entire status");
  if (status.ok && status.stdout.toLowerCase().includes("enabled")) {
    log.success("already enabled");
    return;
  }

  const result = exec("entire enable");
  if (result.ok) {
    log.success("enabled");
  } else {
    log.error(`failed to enable Entire: ${result.stderr}`);
  }
}
