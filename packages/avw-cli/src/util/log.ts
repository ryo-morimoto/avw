import pc from "picocolors";

export function success(msg: string): void {
  console.log(pc.green(`  ✓ ${msg}`));
}

export function error(msg: string): void {
  console.log(pc.red(`  ✗ ${msg}`));
}

export function info(msg: string): void {
  console.log(`  → ${msg}`);
}

export function warn(msg: string): void {
  console.log(pc.yellow(`  ⚠ ${msg}`));
}

export function heading(msg: string): void {
  console.log(`\n${msg}`);
}
