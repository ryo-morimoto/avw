## ADDED Requirements

### Requirement: Solutions directory structure
The system SHALL maintain a knowledge base at `openspec/solutions/` organized by capability name.

#### Scenario: Directory mirrors specs namespace
- **WHEN** `openspec/specs/auth/spec.md` exists
- **THEN** `openspec/solutions/auth/` is the corresponding knowledge directory

#### Scenario: Solutions directory created on init
- **WHEN** `avw init` runs (or the avw schema is first used)
- **THEN** `openspec/solutions/` directory exists

### Requirement: Solution file format
Each solution file SHALL be a markdown document with YAML frontmatter.

#### Scenario: Solution file naming
- **WHEN** a compound artifact is promoted to solutions
- **THEN** the file is named `<YYYY-MM-DD>-<slug>.md` (e.g., `2026-02-11-jwt-session-handling.md`)

#### Scenario: Solution is self-contained
- **WHEN** a solution file is read
- **THEN** it contains all context needed to understand and apply the knowledge without reading other files

### Requirement: Git-based freshness tracking
Solution freshness SHALL be determined by comparing solution date against spec modification date using git history.

#### Scenario: Fresh solution
- **WHEN** a solution's `date` field is more recent than the last commit modifying `openspec/specs/<spec_ref>/spec.md`
- **THEN** the solution is considered FRESH

#### Scenario: Stale solution
- **WHEN** a solution's `date` field is older than the last commit modifying `openspec/specs/<spec_ref>/spec.md`
- **THEN** the solution is considered STALE
- **THEN** agents referencing this solution in Prior Art sections SHALL mark it `[STALE]`

### Requirement: Solutions are referenced during proposal creation
The avw schema's proposal template SHALL direct agents to search solutions before writing a proposal.

#### Scenario: Solutions exist for target capability
- **WHEN** an agent creates a proposal for a change targeting capability `auth`
- **THEN** the agent lists all entries in `openspec/solutions/auth/` in the Prior Art section
- **THEN** stale entries are marked with `[STALE]`

#### Scenario: No solutions exist
- **WHEN** `openspec/solutions/<capability>/` is empty or does not exist
- **THEN** the agent writes "No relevant solutions found" in the Prior Art section

### Requirement: Solutions survive change archival
Solutions promoted from compound artifacts SHALL persist independently of the archived change.

#### Scenario: Change archived, solution persists
- **WHEN** a change is archived to `openspec/changes/archive/`
- **THEN** the promoted solution file remains in `openspec/solutions/<spec_ref>/`
- **THEN** the solution is accessible to future changes
