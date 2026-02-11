## Why

The project name (`opsx-compound`), schema name (`verified`), and CLI/skill prefix (`avw-*`) are all different. Users encounter three unrelated names for the same system, increasing cognitive load. Unifying everything under `avw` (Agent Verification Workflow) with a README explaining the acronym provides a consistent experience.

## What Changes

- **BREAKING** Rename project identity from `opsx-compound` to `avw` (README and internal references only — repository name and directory structure unchanged)
- **BREAKING** Rename schema from `verified` to `avw` (`openspec/schemas/verified/` → `openspec/schemas/avw/`)
- Update `name: verified` → `name: avw` and `description` in schema.yaml
- Update `verified` references in the `avw-cli` change proposal
- Rename existing spec `openspec/specs/verified-schema/` → `openspec/specs/avw-schema/`
- Create README.md with AVW acronym explanation, overview, dependency list, and usage guide

## Capabilities

### New Capabilities

### Modified Capabilities
- `verified-schema`: Rename schema from `verified` to `avw`. Update schema.yaml `name` field, directory name, and all document references

## Impact

- **Modified files**: `openspec/schemas/verified/` → `openspec/schemas/avw/` (directory rename), `openspec/specs/verified-schema/` → `openspec/specs/avw-schema/`, `openspec/changes/avw-cli/proposal.md` (reference update)
- **New files**: `README.md`
- **Breaking changes**: `--schema verified` becomes `--schema avw`. No external users yet, so impact is limited
- **Downstream**: `avw-cli` change will reference the `avw` schema going forward
