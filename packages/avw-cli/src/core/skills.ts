import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as log from "../util/log.js";

// Skill templates (inlined as strings by Bun at build time)
import skillNewTpl from "../../../../templates/skills/avw-new.md";
import skillDemoTpl from "../../../../templates/skills/avw-demo.md";
import skillFullTpl from "../../../../templates/skills/avw-full.md";

// OpenCode command templates
import cmdNewTpl from "../../../../templates/commands/avw-new.md";
import cmdDemoTpl from "../../../../templates/commands/avw-demo.md";
import cmdFullTpl from "../../../../templates/commands/avw-full.md";

interface Tool {
  name: string;
  dir: string;
  skillsDir: string;
  commandDir?: string;
}

const TOOLS: Tool[] = [
  { name: "Claude Code", dir: ".claude", skillsDir: ".claude/skills" },
  { name: "Codex", dir: ".codex", skillsDir: ".codex/skills" },
  { name: "OpenCode", dir: ".opencode", skillsDir: ".opencode/skills", commandDir: ".opencode/command" },
];

const SKILL_TEMPLATES: Record<string, string> = {
  "avw-new": skillNewTpl,
  "avw-demo": skillDemoTpl,
  "avw-full": skillFullTpl,
};

const COMMAND_TEMPLATES: Record<string, string> = {
  "avw-new": cmdNewTpl,
  "avw-demo": cmdDemoTpl,
  "avw-full": cmdFullTpl,
};

const TEMPLATE_VARS: Record<string, string> = {
  "{{openspec_cmd}}": "openspec",
};

function render(template: string): string {
  let result = template;
  for (const [key, value] of Object.entries(TEMPLATE_VARS)) {
    result = result.replaceAll(key, value);
  }
  return result;
}

export function detect(): Tool[] {
  log.heading("Detecting coding tools...");

  const detected: Tool[] = [];
  for (const tool of TOOLS) {
    if (existsSync(tool.dir)) {
      log.success(`${tool.name} (${tool.dir}/)`);
      detected.push(tool);
    }
  }

  if (detected.length === 0) {
    log.warn("No coding tools detected");
  }

  return detected;
}

export function generate(tools: Tool[]): void {
  if (tools.length === 0) return;

  log.heading("Generating skills...");

  try {
    for (const tool of tools) {
      for (const [name, template] of Object.entries(SKILL_TEMPLATES)) {
        const dir = join(tool.skillsDir, name);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "SKILL.md"), render(template));
      }
      log.info(`${tool.skillsDir}/avw-{new,demo,full}/SKILL.md`);

      if (tool.commandDir) {
        mkdirSync(tool.commandDir, { recursive: true });
        for (const [name, template] of Object.entries(COMMAND_TEMPLATES)) {
          writeFileSync(join(tool.commandDir, `${name}.md`), render(template));
        }
        log.info(`${tool.commandDir}/avw-{new,demo,full}.md`);
      }
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    log.error(`Failed to write skill files: ${msg}`);
    process.exit(1);
  }
}
