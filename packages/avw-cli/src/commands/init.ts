import { checkNode, checkDeps, checkOpenSpec } from "../core/validation.js";
import { install } from "../core/schema.js";
import { detect, generate } from "../core/skills.js";
import { enable } from "../core/entire.js";
import * as log from "../util/log.js";

export function init(): void {
  if (!checkNode()) process.exit(1);
  if (!checkDeps()) process.exit(1);
  if (!checkOpenSpec()) process.exit(1);

  install();

  const tools = detect();
  generate(tools);

  enable();

  log.heading("Setup complete!");
  if (tools.length > 0) {
    const names = tools.map((t) => t.name).join(", ");
    log.info(`Tools: ${names}`);
    log.info(`Skills: ${tools.length * 3} files generated`);
  }
  log.info("Start a change with /avw:new");
}
