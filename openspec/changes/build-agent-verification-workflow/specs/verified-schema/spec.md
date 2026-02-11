## ADDED Requirements

### Requirement: Schema definition file
The system SHALL provide a schema definition at `openspec/schemas/verified/schema.yaml` that extends the spec-driven workflow with a post-implementation demo artifact.

#### Scenario: Schema is valid OpenSpec schema
- **WHEN** `openspec schema validate verified` is run
- **THEN** validation passes with no errors

#### Scenario: Schema defines complete artifact DAG
- **WHEN** the schema is loaded
- **THEN** it defines exactly 5 artifacts: `proposal`, `specs`, `design`, `tasks`, `demo`
- **THEN** the dependency graph is: proposal → {specs, design}, {specs, design} → tasks, tasks → demo

#### Scenario: Schema is selectable via CLI
- **WHEN** `openspec new change "test" --schema verified` is run
- **THEN** a change is created with schema `verified`
- **THEN** `openspec status --change "test"` shows all 5 artifacts

### Requirement: Demo artifact template
The system SHALL include a template for the `demo` artifact that instructs agents to construct a Showboat document with Rodney browser automation.

#### Scenario: Demo template references Showboat CLI
- **WHEN** `openspec instructions demo --change "<name>"` is run
- **THEN** the instruction includes `showboat init`, `showboat note`, `showboat exec`, `showboat image`, and `showboat verify` commands

#### Scenario: Demo template references Rodney CLI
- **WHEN** `openspec instructions demo --change "<name>"` is run
- **THEN** the instruction includes `rodney start`, `rodney open`, `rodney screenshot`, and `rodney stop` commands for browser verification

#### Scenario: Demo depends on tasks
- **WHEN** a change is created with the verified schema
- **THEN** the demo artifact has status `blocked` until the tasks artifact is `done`

### Requirement: Apply instruction includes Entire operational guidance
The schema's apply instruction SHALL include guidance on using Entire commands during implementation.

#### Scenario: Entire rewind guidance
- **WHEN** `openspec instructions apply --change "<name>"` is run on a verified-schema change
- **THEN** the instruction includes guidance on `entire rewind` for rolling back to a previous checkpoint when implementation breaks

#### Scenario: Entire status guidance
- **WHEN** `openspec instructions apply --change "<name>"` is run on a verified-schema change
- **THEN** the instruction includes guidance on `entire status` for checking current session state

### Requirement: Apply configuration
The schema SHALL configure `apply` to track `tasks.md` and require the `tasks` artifact.

#### Scenario: Apply tracks tasks
- **WHEN** `openspec instructions apply --change "<name>"` is run on a verified-schema change
- **THEN** the context files include proposal, specs, design, and tasks

### Requirement: Reuse spec-driven templates for planning artifacts
The schema SHALL reuse the standard spec-driven templates for proposal, specs, design, and tasks artifacts.

#### Scenario: Planning artifact templates
- **WHEN** `openspec instructions proposal --change "<name>"` is run on a verified-schema change
- **THEN** the template matches the spec-driven schema's proposal template
