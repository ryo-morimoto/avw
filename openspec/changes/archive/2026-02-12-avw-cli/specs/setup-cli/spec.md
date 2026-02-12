## ADDED Requirements

### Requirement: npm package structure
The CLI SHALL be published as an npm package at `packages/avw-cli/` with a `bin` entry exposing the `avw` command.

#### Scenario: Package is installable and executable
- **WHEN** `npx avw --help` is run in any project directory
- **THEN** the CLI prints usage information listing `init` and `update` subcommands
- **THEN** the exit code is 0

#### Scenario: Package has correct bin entry
- **WHEN** the package.json `bin` field is inspected
- **THEN** it maps `avw` to the compiled CLI entry point

### Requirement: avw init — dependency validation
The `avw init` command SHALL validate that all required system dependencies are present before proceeding with setup.

#### Scenario: All dependencies present
- **WHEN** `avw init` is run and openspec, entire, showboat, rodney, and Chrome are all installed
- **THEN** each dependency is listed with a checkmark and its detected version
- **THEN** setup proceeds to the next phase

#### Scenario: Some dependencies missing
- **WHEN** `avw init` is run and one or more dependencies are missing
- **THEN** each missing dependency is listed with an error marker
- **THEN** install instructions are printed for each missing dependency
- **THEN** the CLI exits with a non-zero exit code without proceeding further

#### Scenario: Dependency check covers all required tools
- **WHEN** `avw init` runs the dependency check phase
- **THEN** it validates exactly: `openspec`, `entire`, `showboat`, `rodney`, and a Chromium-based browser

### Requirement: avw init — openspec initialization check
The `avw init` command SHALL verify that OpenSpec is initialized in the current project before installing the schema.

#### Scenario: OpenSpec already initialized
- **WHEN** `avw init` is run in a project where `openspec init` has been run
- **THEN** setup proceeds to schema installation

#### Scenario: OpenSpec not initialized
- **WHEN** `avw init` is run in a project without an `openspec/` directory
- **THEN** the CLI prints an error instructing the user to run `openspec init` first
- **THEN** the CLI exits with a non-zero exit code

### Requirement: avw init — schema installation
The `avw init` command SHALL copy the bundled AVW schema files into the project's `openspec/schemas/avw/` directory.

#### Scenario: Schema files are copied
- **WHEN** `avw init` completes schema installation
- **THEN** `openspec/schemas/avw/schema.yaml` exists with the AVW schema definition
- **THEN** all template files from the bundled schema are present in `openspec/schemas/avw/templates/`

#### Scenario: Schema already exists
- **WHEN** `avw init` is run and `openspec/schemas/avw/` already exists
- **THEN** the existing schema files are overwritten with the bundled version
- **THEN** the CLI prints a message indicating the schema was updated

### Requirement: avw init — coding tool detection
The `avw init` command SHALL detect which coding tools are configured in the project by checking for their configuration directories.

#### Scenario: Multiple tools detected
- **WHEN** `avw init` is run in a project with `.claude/`, `.codex/`, and `.opencode/` directories
- **THEN** all three tools are listed as detected

#### Scenario: No tools detected
- **WHEN** `avw init` is run in a project with none of the known tool directories
- **THEN** the CLI prints a warning that no coding tools were detected
- **THEN** setup continues without generating skills (no error)

#### Scenario: Supported tool directories
- **WHEN** `avw init` scans for coding tools
- **THEN** it checks for exactly: `.claude/`, `.codex/`, `.opencode/`

### Requirement: avw init — skill generation
The `avw init` command SHALL generate AVW skill files for each detected coding tool.

#### Scenario: Skills generated for Claude Code
- **WHEN** `.claude/` is detected
- **THEN** skill files are written to `.claude/skills/avw-{new,demo,full}/SKILL.md`

#### Scenario: Skills generated for Codex
- **WHEN** `.codex/` is detected
- **THEN** skill files are written to `.codex/skills/avw-{new,demo,full}/SKILL.md`

#### Scenario: Skills generated for OpenCode
- **WHEN** `.opencode/` is detected
- **THEN** skill files are written to `.opencode/skills/avw-{new,demo,full}/SKILL.md`
- **THEN** command files are also written to `.opencode/command/avw-{new,demo,full}.md`

#### Scenario: Skill content uses bundled templates
- **WHEN** skill files are generated
- **THEN** the content is rendered from templates bundled in the npm package
- **THEN** project-specific values (e.g., schema name) are interpolated into the templates

### Requirement: avw init — Entire enablement
The `avw init` command SHALL ensure Entire is enabled for the project.

#### Scenario: Entire not yet enabled
- **WHEN** `avw init` is run and Entire is not enabled for the project
- **THEN** the CLI enables Entire
- **THEN** the CLI prints confirmation that Entire was enabled

#### Scenario: Entire already enabled
- **WHEN** `avw init` is run and Entire is already enabled
- **THEN** the CLI prints "Entire: already enabled"
- **THEN** no duplicate enablement is performed

### Requirement: avw init — summary output
The `avw init` command SHALL print a summary upon successful completion.

#### Scenario: Successful init summary
- **WHEN** `avw init` completes successfully
- **THEN** the CLI prints a summary listing: dependencies checked, schema installed, tools detected, skills generated, Entire status
- **THEN** the final line suggests starting a change with the appropriate skill command

### Requirement: avw update — schema and skill refresh
The `avw update` command SHALL re-generate skills and update the schema without modifying Entire configuration.

#### Scenario: Update refreshes schema
- **WHEN** `avw update` is run
- **THEN** the bundled schema files overwrite `openspec/schemas/avw/`

#### Scenario: Update regenerates skills
- **WHEN** `avw update` is run
- **THEN** skill files are regenerated for all detected coding tools

#### Scenario: Update skips Entire
- **WHEN** `avw update` is run
- **THEN** the Entire enablement step is skipped entirely

#### Scenario: Update skips dependency validation
- **WHEN** `avw update` is run
- **THEN** the dependency validation phase is skipped (assumes dependencies were validated during init)

### Requirement: CLI error handling
The CLI SHALL provide clear error messages and appropriate exit codes for all failure modes.

#### Scenario: Unknown subcommand
- **WHEN** `avw foobar` is run
- **THEN** the CLI prints an error with usage information
- **THEN** the exit code is non-zero

#### Scenario: File system errors
- **WHEN** the CLI cannot write to the target directory (e.g., permissions)
- **THEN** the CLI prints a descriptive error message
- **THEN** the exit code is non-zero

### Requirement: Minimum Node.js version
The CLI SHALL require Node.js >= 20 and fail gracefully on older versions.

#### Scenario: Supported Node.js version
- **WHEN** `avw init` is run on Node.js 20 or later
- **THEN** the CLI operates normally

#### Scenario: Unsupported Node.js version
- **WHEN** `avw init` is run on Node.js < 20
- **THEN** the CLI prints an error stating the minimum required version
- **THEN** the exit code is non-zero
