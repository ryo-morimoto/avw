## ADDED Requirements

### Requirement: Compound artifact is a required DAG node
The compound artifact SHALL be a required artifact in the `avw` schema DAG. Changes MUST NOT be archived without a completed compound artifact.

#### Scenario: Archive blocked without compound
- **WHEN** an agent attempts to archive an avw-schema change
- **THEN** `openspec status --change "<name>"` shows compound as incomplete
- **THEN** archive cannot proceed until compound.md exists

#### Scenario: Compound completable after tasks
- **WHEN** tasks artifact is done
- **THEN** compound artifact status changes from `blocked` to `ready`

### Requirement: Compound YAML frontmatter
The compound artifact SHALL include structured YAML frontmatter linking knowledge to specifications.

#### Scenario: Required frontmatter fields
- **WHEN** an agent creates compound.md
- **THEN** it includes `spec_ref` (capability name matching `openspec/specs/<name>/`)
- **THEN** it includes `date` (ISO 8601 YYYY-MM-DD)
- **THEN** it includes `problem_type` (enum: build_error, runtime_error, workflow_issue, best_practice, performance_issue, security_issue, integration_issue, logic_error)
- **THEN** it includes `severity` (enum: critical, high, medium, low)

#### Scenario: Optional frontmatter fields
- **WHEN** an agent creates compound.md
- **THEN** it MAY include `tags` (array of lowercase, hyphen-separated keywords)

### Requirement: Compound content sections
The compound artifact SHALL include all required content sections for knowledge reuse.

#### Scenario: All sections present
- **WHEN** compound.md is created
- **THEN** it contains: `## Problem`, `## What Didn't Work`, `## Solution`, `## Why This Works`, `## Prevention`

#### Scenario: What Didn't Work captures dead ends
- **WHEN** the agent explored approaches that failed during implementation
- **THEN** each failed approach is listed with the technical reason it was rejected

#### Scenario: Solution includes code examples
- **WHEN** the solution involves code changes
- **THEN** the Solution section includes before/after code examples

### Requirement: Compound creation checks existing solutions
The compound template instruction SHALL direct agents to check for existing solutions before creating new ones.

#### Scenario: Existing solutions found
- **WHEN** `openspec/solutions/<spec_ref>/` contains entries related to the current work
- **THEN** the agent evaluates whether to create a new solution or update an existing one
- **THEN** if updating, the agent copies the existing solution into the change directory, modifies it, and archive overwrites the original

#### Scenario: No existing solutions
- **WHEN** `openspec/solutions/<spec_ref>/` is empty or does not exist
- **THEN** the agent creates a new compound.md entry

### Requirement: Archive promotes compound to solutions
During archive, compound.md SHALL be copied to `openspec/solutions/<spec_ref>/` as a permanent knowledge entry.

#### Scenario: Promotion on archive
- **WHEN** a change with a completed compound.md is archived
- **THEN** compound.md is copied to `openspec/solutions/<spec_ref>/<date>-<slug>.md`
- **THEN** the slug is derived from the H1 title, kebab-cased

#### Scenario: Update overwrites on archive
- **WHEN** compound.md updates an existing solution
- **THEN** the archive process overwrites the original file in `openspec/solutions/`
