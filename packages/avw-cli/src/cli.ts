import { parseArgs } from "node:util";
import { init } from "./commands/init.js";
import { update } from "./commands/update.js";

const USAGE = `avw - Agent Verification Workflow setup CLI

Usage:
  avw <command>

Commands:
  init    Set up AVW in the current project
  update  Refresh schema and skills from latest version

Options:
  --help  Show this help message`;

function main(): void {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    strict: false,
    options: {
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help || positionals.length === 0) {
    console.log(USAGE);
    process.exit(0);
  }

  const command = positionals[0];

  switch (command) {
    case "init":
      init();
      break;
    case "update":
      update();
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      console.log(USAGE);
      process.exit(1);
  }
}

main();
