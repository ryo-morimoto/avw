import { existsSync } from "node:fs";
import { exec } from "../util/exec.js";
import * as log from "../util/log.js";

export function checkNode(): boolean {
  const [major] = process.versions.node.split(".").map(Number);
  if (major < 20) {
    log.error(`Node.js >= 20 required (found ${process.versions.node})`);
    return false;
  }
  return true;
}

interface DepCheck {
  name: string;
  commands: string[];
  versionFlag: string;
  installHint: string;
}

const DEPS: DepCheck[] = [
  {
    name: "openspec",
    commands: ["openspec"],
    versionFlag: "--version",
    installHint: "npm i -g @fission-ai/openspec",
  },
  {
    name: "entire",
    commands: ["entire"],
    versionFlag: "--version",
    installHint: "brew install entireio/tap/entire  (or: curl -fsSL https://entire.io/install.sh | bash)",
  },
  {
    name: "showboat",
    commands: ["showboat"],
    versionFlag: "--version",
    installHint: "pip install showboat  (or: uvx showboat)",
  },
  {
    name: "rodney",
    commands: ["rodney"],
    versionFlag: "--version",
    installHint: "pip install rodney  (or: uvx rodney)",
  },
  {
    name: "Chrome",
    commands: [
      "google-chrome",
      "chromium",
      "chromium-browser",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ],
    versionFlag: "--version",
    installHint: "Install Google Chrome or Chromium",
  },
];

export function checkDeps(): boolean {
  log.heading("Checking dependencies...");

  const missing: DepCheck[] = [];

  for (const dep of DEPS) {
    let found = false;
    for (const cmd of dep.commands) {
      const which = exec(`which ${cmd}`);
      if (which.ok) {
        const version = exec(`${cmd} ${dep.versionFlag}`);
        const ver = version.ok ? version.stdout.split("\n")[0] : "";
        log.success(`${dep.name}${ver ? ` ${ver}` : ""}`);
        found = true;
        break;
      }
    }
    if (!found) {
      log.error(`${dep.name} not found`);
      missing.push(dep);
    }
  }

  if (missing.length > 0) {
    console.log("\nMissing dependencies:");
    for (const dep of missing) {
      console.log(`  ${dep.name}: ${dep.installHint}`);
    }
    console.log("\nFix the above and run 'avw init' again.");
    return false;
  }

  return true;
}

export function checkOpenSpec(): boolean {
  if (!existsSync("openspec")) {
    log.error("OpenSpec not initialized in this project");
    console.log("  Run 'openspec init' first.");
    return false;
  }
  return true;
}
