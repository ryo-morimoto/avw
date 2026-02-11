## ADDED Requirements

### Requirement: Schema definition with 6 artifacts
The system SHALL provide a schema definition at `openspec/schemas/avw/schema.yaml` with 6 artifacts and structural enforcement of knowledge recording and referencing.

#### Scenario: Schema is valid OpenSpec schema
- **WHEN** `openspec schema validate avw` is run
- **THEN** validation passes with no errors

#### Scenario: Schema defines complete artifact DAG
- **WHEN** the schema is loaded
- **THEN** it defines exactly 6 artifacts: `proposal`, `specs`, `design`, `tasks`, `demo`, `compound`
- **THEN** the dependency graph is: proposal → {specs, design}, {specs, design} → tasks, tasks → {demo, compound}

#### Scenario: Schema is selectable via CLI
- **WHEN** `openspec new change "test" --schema avw` is run
- **THEN** a change is created with schema `avw`
- **THEN** `openspec status --change "test"` shows all 6 artifacts

### Requirement: Proposal template with Prior Art section
The schema's proposal template SHALL include a required `## Prior Art` section that forces referencing `openspec/solutions/`.

#### Scenario: Prior Art in proposal template
- **WHEN** `openspec instructions proposal --change "<name>"` is run on an avw-schema change
- **THEN** the template includes a `## Prior Art` section
- **THEN** the instruction directs the agent to search `openspec/solutions/<capability>/` for each target capability
- **THEN** the instruction directs the agent to mark stale solutions with `[STALE]`

### Requirement: Demo artifact template with Showboat/Rodney
The schema SHALL include a demo template instructing agents to use Showboat CLI and Rodney for browser automation.

#### Scenario: Demo template references Showboat and Rodney
- **WHEN** `openspec instructions demo --change "<name>"` is run
- **THEN** the instruction includes `showboat init`, `showboat note`, `showboat exec`, `showboat image`, `showboat verify` commands
- **THEN** the instruction includes `rodney start`, `rodney open`, `rodney screenshot`, `rodney stop` commands

#### Scenario: Demo depends on tasks
- **WHEN** a change is created with the avw schema
- **THEN** the demo artifact has status `blocked` until the tasks artifact is `done`

### Requirement: Compound artifact template
The schema SHALL include a compound template for curated knowledge extraction with YAML frontmatter.

#### Scenario: Compound template structure
- **WHEN** `openspec instructions compound --change "<name>"` is run
- **THEN** the instruction includes required sections: Problem, What Didn't Work, Solution, Why This Works, Prevention
- **THEN** the instruction includes required YAML frontmatter fields: spec_ref, date, problem_type, severity

#### Scenario: Compound depends on tasks
- **WHEN** a change is created with the avw schema
- **THEN** the compound artifact has status `blocked` until the tasks artifact is `done`

#### Scenario: Compound instructs new vs update decision
- **WHEN** `openspec instructions compound --change "<name>"` is run
- **THEN** the instruction directs the agent to check `openspec/solutions/<spec_ref>/` for existing entries
- **THEN** the instruction guides choosing between creating a new solution or updating an existing one

### Requirement: Apply instruction includes Entire operational guidance
The schema's apply instruction SHALL include guidance on using Entire commands during implementation.

#### Scenario: Entire guidance in apply
- **WHEN** `openspec instructions apply --change "<name>"` is run on an avw-schema change
- **THEN** the instruction includes guidance on `entire status`, `entire rewind`, and `entire resume`

### Requirement: Apply configuration
The schema SHALL configure `apply` to track `tasks.md` and require the `tasks` artifact.

#### Scenario: Apply tracks tasks
- **WHEN** `openspec instructions apply --change "<name>"` is run on an avw-schema change
- **THEN** the context files include proposal, specs, design, and tasks
