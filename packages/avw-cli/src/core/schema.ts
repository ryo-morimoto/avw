import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as log from "../util/log.js";

// Schema definition (inlined as JS object by Bun at build time)
import schemaYaml from "../../../../openspec/schemas/avw/schema.yaml";

// Templates (inlined as strings by Bun at build time)
import proposalTpl from "../../../../openspec/schemas/avw/templates/proposal.md";
import specTpl from "../../../../openspec/schemas/avw/templates/spec.md";
import designTpl from "../../../../openspec/schemas/avw/templates/design.md";
import tasksTpl from "../../../../openspec/schemas/avw/templates/tasks.md";
import demoTpl from "../../../../openspec/schemas/avw/templates/demo.md";
import compoundTpl from "../../../../openspec/schemas/avw/templates/compound.md";

// Re-serialize the YAML object back to YAML string for writing
import { stringify } from "../util/yaml.js";

const TEMPLATES: Record<string, string> = {
  "proposal.md": proposalTpl,
  "spec.md": specTpl,
  "design.md": designTpl,
  "tasks.md": tasksTpl,
  "demo.md": demoTpl,
  "compound.md": compoundTpl,
};

export function install(): void {
  const schemaDir = join("openspec", "schemas", "avw");
  const templatesDir = join(schemaDir, "templates");
  const updating = existsSync(schemaDir);

  log.heading(updating ? "Updating avw schema..." : "Installing avw schema...");

  try {
    mkdirSync(templatesDir, { recursive: true });
    writeFileSync(join(schemaDir, "schema.yaml"), stringify(schemaYaml));
    for (const [name, content] of Object.entries(TEMPLATES)) {
      writeFileSync(join(templatesDir, name), content);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    log.error(`Failed to write schema files: ${msg}`);
    process.exit(1);
  }

  log.success(updating ? "schema updated" : "schema installed");
}
