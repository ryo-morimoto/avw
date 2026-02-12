import { execSync } from "node:child_process";

export interface ExecResult {
  ok: boolean;
  stdout: string;
  stderr: string;
}

export function exec(command: string): ExecResult {
  try {
    const stdout = execSync(command, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
    return { ok: true, stdout, stderr: "" };
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string };
    return {
      ok: false,
      stdout: (err.stdout ?? "").trim(),
      stderr: (err.stderr ?? "").trim(),
    };
  }
}
