## Context

The project currently uses three different names: `opsx-compound` (project), `verified` (schema), and `avw-*` (CLI/skills). This change unifies them under `avw`. The rename is purely cosmetic — no logic, dependencies, or APIs change.

## Goals / Non-Goals

**Goals:**
- Single consistent name (`avw`) across schema, CLI, skills, and project identity
- README explaining what AVW stands for

**Non-Goals:**
- Renaming the git repository or GitHub URL — out of scope
- Changing any functional behavior
- Modifying the `avw-cli` change beyond updating `verified` references

## Decisions

### 1. Rename scope: identity only, not repository

**Decision**: Change the project identity in README and internal references. Do not rename the GitHub repository.

**Rationale**: Repository rename is disruptive (breaks clones, links, CI). The project is early enough that the README identity is sufficient. Repository rename can happen later if needed.

### 2. Spec rename: `verified-schema` → `avw-schema`

**Decision**: Rename `openspec/specs/verified-schema/` to `openspec/specs/avw-schema/` since the spec describes the schema and the schema is being renamed.

**Rationale**: Spec directory names should match what they describe. A spec called `verified-schema` describing a schema named `avw` would be confusing.

### 3. Archived change references: leave as-is

**Decision**: Do not update references inside `openspec/changes/archive/`. The archived change used `verified` at the time — that's historical record.

**Rationale**: Archives are snapshots. Rewriting history creates confusion about what was actually built.

## Risks / Trade-offs

**[Stale references]** Some internal documents may still say `verified`. → Grep for `verified` after rename to catch stragglers.

**[avw-cli change dependency]** The `avw-cli` change proposal references `verified`. → Update the reference in this change.
