## Why

Coding agents produce code but lose context. OpenSpec solves "what to build" via specs. But three gaps remain: (1) passing automated tests doesn't prove software works — agents need to demonstrate visually; (2) agents lack operational guidance on Entire during development; (3) knowledge gained during implementation is not captured in a reusable, searchable format — it evaporates when the change is archived. The compound-engineering principle ("document the solution so the next occurrence takes minutes") has no structural enforcement in the spec-driven workflow.

## What Changes

- Create a custom OpenSpec schema (`verified`) extending `spec-driven` with two new artifacts: `demo` (visual proof via Showboat + Rodney) and `compound` (curated knowledge extraction)
- The `compound` artifact forces knowledge recording — changes cannot be archived without it
- The `proposal` template requires a `Prior Art` section querying `openspec/solutions/` — forces referencing past knowledge before starting
- On archive, `compound.md` is copied to `openspec/solutions/<spec_ref>/` (same pattern as delta specs merging to `openspec/specs/`)
- Embed Entire operational guidance in apply/demo instructions
- Create skill templates for distribution by the `avw-cli` package

## Capabilities

### New Capabilities
- `verified-schema`: Custom OpenSpec schema with 6 artifacts (proposal → specs + design → tasks → demo + compound), Entire operational guidance, and structural enforcement of knowledge recording and referencing
- `demo-artifact`: Showboat + Rodney demonstration artifact — agents construct executable proof-of-work, not editable markdown
- `compound-artifact`: Curated knowledge extraction with `spec_ref` linking, YAML frontmatter for searchability, and archive-time promotion to `openspec/solutions/`
- `solutions-store`: `openspec/solutions/` directory as the persistent knowledge base, organized by capability, with git-based freshness tracking
- `skill-templates`: Canonical skill template files for distribution by the CLI package

### Modified Capabilities

## Impact

- **New files**: `openspec/schemas/verified/`, `openspec/solutions/`, skill templates
- **Dependencies at runtime**: `@fission-ai/openspec`, `entireio/cli`, `showboat`, `rodney` (+ Chrome)
- **No breaking changes**: `spec-driven` untouched. `verified` is opt-in
- **Downstream**: `avw-cli` depends on this schema, templates, and solutions directory structure
