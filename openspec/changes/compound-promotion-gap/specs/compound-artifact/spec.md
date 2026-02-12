## MODIFIED Requirements

### Requirement: Archive promotes compound to solutions
During archive, compound.md SHALL be promoted to `openspec/solutions/<spec_ref>/` via the schema's `archive.promote` rule — not via manual file operations.

#### Scenario: Promotion on archive
- **WHEN** a change with a completed compound.md is archived
- **THEN** `openspec archive` reads the `archive.promote` rule from the avw schema
- **THEN** compound.md is copied to `openspec/solutions/<spec_ref>/<date>-<slug>.md`
- **THEN** the slug is derived from the H1 title, kebab-cased

#### Scenario: Update overwrites on archive
- **WHEN** compound.md updates an existing solution
- **THEN** the archive process overwrites the original file in `openspec/solutions/` per `on_conflict: overwrite`

#### Scenario: Target directory created automatically
- **WHEN** `openspec/solutions/<spec_ref>/` does not exist
- **THEN** the archive process creates the directory before copying
