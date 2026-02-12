## Why

Compound promotion (`compound.md → openspec/solutions/`) is described in artifact instructions and skill templates but not structurally enforced by the schema. The `avw-full` skill template includes a fragile manual `cp` fallback for when `openspec archive` doesn't handle promotion. Without a schema-level declaration, the feedback loop (compound → solutions → prior art) depends entirely on agent behavior and is unreliable.

## What Changes

- Add `archive.promote` section to `schema.yaml` declaring how compound artifacts are promoted to `openspec/solutions/` during archive
- Update `avw-full` skill template to remove manual `cp` fallback and reference the schema-level rule
- Update specs to cover archive promotion as a schema-level requirement

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `avw-schema`: Add requirement for `archive.promote` configuration in schema definition
- `compound-artifact`: Strengthen archive promotion requirement to reference schema-level mechanism
- `agent-skill-orchestration`: Update avw-full template requirement to remove manual fallback

## Prior Art

No relevant solutions found. The `openspec/solutions/` store is empty.

## Impact

- `openspec/schemas/avw/schema.yaml` — new `archive` top-level section
- `templates/skills/avw-full.md` — Stage 7 archive instructions simplified
- `openspec/specs/avw-schema/spec.md` — new requirement added
- `openspec/specs/compound-artifact/spec.md` — existing requirement updated
- `openspec/specs/agent-skill-orchestration/spec.md` — existing requirement updated
- `packages/avw-cli/` — no code changes (already bundles full schema.yaml)
