## Context

The avw schema defines a knowledge compounding loop: compound artifacts are promoted to `openspec/solutions/` on archive, and future proposals reference them as prior art. Currently, the promotion is described in artifact instructions and the avw-full skill template, but it's not structurally enforced. The avw-full template includes a manual `cp` fallback that is fragile and depends on agents correctly parsing frontmatter.

## Goals / Non-Goals

**Goals:**
- Declare compound promotion as a schema-level rule in `schema.yaml`
- Make `openspec archive` the single command that handles all archive operations including promotion
- Remove manual file copy fallbacks from skill templates

**Non-Goals:**
- Implementing the `archive.promote` feature in the openspec CLI (separate repo/change)
- Changing compound.md structure or frontmatter format
- Adding promotion for other artifact types

## Decisions

### Decision 1: `archive.promote` as a schema-level array

The promotion rule is added as `archive.promote` — an array of promotion entries, each specifying:
- `artifact`: which artifact to promote
- `to`: target path pattern with template variables
- `slug`: derivation method for the `{{slug}}` variable
- `on_conflict`: how to handle existing files

**Rationale**: An array allows schemas to declare multiple promotions if needed. Template variables (`{{frontmatter.spec_ref}}`, `{{frontmatter.date}}`, `{{slug}}`) keep the rule generic — openspec reads frontmatter at archive time.

**Alternative considered**: Hardcoding the promotion path in openspec for the avw schema. Rejected because this couples openspec to avw-specific behavior.

### Decision 2: Template variable syntax `{{frontmatter.*}}`

Variables reference YAML frontmatter fields via `{{frontmatter.<field>}}` and derived values via `{{slug}}`. This matches the existing `{{openspec_cmd}}` pattern used in skill templates.

**Rationale**: Consistent with existing template variable conventions. Frontmatter fields are already required by the compound artifact instruction, so they're guaranteed to exist.

### Decision 3: `on_conflict: overwrite` as the default for compound

The compound spec already describes the "update existing solution" flow where agents copy an existing solution into the change, modify it, and expect archive to overwrite the original. `on_conflict: overwrite` makes this explicit.

## Risks / Trade-offs

[Risk] openspec CLI doesn't support `archive.promote` yet → Schema declares the rule, openspec needs to implement it. Until then, agents see the rule in the schema but promotion doesn't happen automatically. Mitigation: the schema instruction is the source of truth — agents can still follow it manually.

[Risk] Invalid frontmatter breaks promotion → If `spec_ref` or `date` is missing, the path template can't be resolved. Mitigation: openspec should validate required frontmatter fields before promoting. Validation failures should block archive with a clear error.
