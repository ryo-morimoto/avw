## MODIFIED Requirements

### Requirement: avw-full includes compound step
The `avw-full` skill template SHALL rely on `openspec archive` to promote compound.md via the schema's `archive.promote` rule. The template MUST NOT include manual file copy fallbacks.

#### Scenario: Compound step in full workflow
- **WHEN** an agent executes the avw:full workflow
- **THEN** after demo creation, the agent creates the compound artifact
- **THEN** the compound artifact must be complete before proceeding to verify

#### Scenario: Archive uses schema-level promotion
- **WHEN** an agent executes the archive step in avw:full
- **THEN** `openspec archive --change "<name>"` is the only command needed
- **THEN** compound.md is promoted to solutions automatically via `archive.promote`
- **THEN** no manual `cp` or `mkdir` commands are present in the template
