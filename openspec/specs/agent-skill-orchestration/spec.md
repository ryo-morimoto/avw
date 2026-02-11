## ADDED Requirements

### Requirement: Canonical skill templates
The system SHALL provide canonical skill template files that the `avw-cli` package distributes to target projects.

#### Scenario: avw-new template exists
- **WHEN** the schema bundle is complete
- **THEN** a `templates/skills/avw-new.md` file exists containing: prerequisite validation commands, `openspec new change --schema avw`, and status display instructions

#### Scenario: avw-demo template exists
- **WHEN** the schema bundle is complete
- **THEN** a `templates/skills/avw-demo.md` file exists containing: task completion guard, Showboat construction flow (`showboat init/note/exec/image`), Rodney browser steps (`rodney start/open/screenshot/ax-tree/stop`), Entire attribution capture, `showboat verify`

#### Scenario: avw-full template exists
- **WHEN** the schema bundle is complete
- **THEN** a `templates/skills/avw-full.md` file exists containing: end-to-end orchestration (prerequisites → new → ff → apply with Entire guidance → demo + compound → verify → archive with solutions promotion) with user confirmation at each stage

### Requirement: avw-full includes compound step
The `avw-full` skill template SHALL include the compound knowledge extraction step between verify and archive.

#### Scenario: Compound step in full workflow
- **WHEN** an agent executes the avw:full workflow
- **THEN** after demo creation, the agent creates the compound artifact
- **THEN** the compound artifact must be complete before proceeding to verify

#### Scenario: Archive includes solutions promotion
- **WHEN** an agent executes the archive step in avw:full
- **THEN** compound.md is copied to `openspec/solutions/<spec_ref>/<date>-<slug>.md`
- **THEN** delta specs are merged to `openspec/specs/` as usual

### Requirement: Templates use variable placeholders
Skill templates SHALL use `{{variable}}` placeholders for tool-specific values.

#### Scenario: Placeholder replacement
- **WHEN** the `avw-cli` package processes a template
- **THEN** `{{openspec_cmd}}` is replaced with the appropriate openspec invocation

### Requirement: OpenCode command templates
The system SHALL provide command template files for OpenCode alongside skill templates.

#### Scenario: Command templates exist
- **WHEN** the schema bundle is complete
- **THEN** `templates/commands/avw-new.md`, `templates/commands/avw-demo.md`, `templates/commands/avw-full.md` exist
