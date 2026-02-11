## Why

Coding agents produce code but lose context. OpenSpec solves "what to build" via specs. But two gaps remain: (1) passing automated tests doesn't prove software works — agents need to demonstrate their work visually; (2) session reasoning is captured by Entire but agents lack operational guidance on using it during development (rewind, explain, resume). No OpenSpec schema exists that combines spec-driven planning with proof-by-demonstration (Showboat + Rodney) and Entire-backed session operations.

## What Changes

- Create a custom OpenSpec schema (`verified`) that extends `spec-driven` with one new artifact: `demo` (visual proof via Showboat + Rodney)
- The demo artifact is constructed entirely via Showboat CLI — agents MUST NOT edit demo.md directly
- Embed Entire operational guidance (`rewind`, `status`, `explain`, `resume`) in the apply and demo artifact instructions
- Require Entire as infrastructure — session context is captured automatically via hooks, no explicit recording step
- Create skill templates (canonical markdown) that the `avw-cli` package (see change: `avw-cli`) will distribute to target projects

## Capabilities

### New Capabilities
- `verified-schema`: Custom OpenSpec schema defining the `verified` workflow (proposal → specs + design → tasks → demo) with artifact templates and instructions, including Entire operational guidance
- `demo-artifact`: Showboat + Rodney demonstration artifact — agents construct executable proof-of-work via `showboat exec/image` with `rodney` browser automation
- `skill-templates`: Canonical skill template files (`avw-new.md`, `avw-demo.md`, `avw-full.md`) for distribution by the CLI package

### Modified Capabilities

## Impact

- **New files**: `openspec/schemas/verified/` (schema.yaml + 5 templates), skill templates for CLI bundling
- **Dependencies at runtime**: `@fission-ai/openspec`, `entireio/cli`, `showboat`, `rodney` (+ Chrome)
- **No breaking changes**: Existing `spec-driven` workflow untouched. `verified` is opt-in via `--schema verified`
- **Downstream**: The `avw-cli` change depends on this schema and templates being finalized
