## ADDED Requirements

### Requirement: Canonical skill templates
The system SHALL provide canonical skill template files that the `avw-cli` package distributes to target projects.

#### Scenario: avw-new template exists
- **WHEN** the schema bundle is complete
- **THEN** a `templates/skills/avw-new.md` file exists containing: prerequisite validation commands, `openspec new change --schema verified`, and status display instructions

#### Scenario: avw-demo template exists
- **WHEN** the schema bundle is complete
- **THEN** a `templates/skills/avw-demo.md` file exists containing: task completion guard, Showboat construction flow (`showboat init/note/exec/image`), Rodney browser steps (`rodney start/open/screenshot/ax-tree/stop`), Entire attribution capture, `showboat verify`

#### Scenario: avw-full template exists
- **WHEN** the schema bundle is complete
- **THEN** a `templates/skills/avw-full.md` file exists containing: end-to-end orchestration (prerequisites → new → ff → apply with Entire guidance → demo → verify → archive) with user confirmation at each stage

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
