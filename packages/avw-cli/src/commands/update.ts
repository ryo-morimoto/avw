import { install } from "../core/schema.js";
import { detect, generate } from "../core/skills.js";

export function update(): void {
  install();

  const tools = detect();
  generate(tools);

  console.log("\nDone! Schema and skills updated.");
}
