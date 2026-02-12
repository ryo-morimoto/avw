## ADDED Requirements

### Requirement: Archive promotion configuration
The schema SHALL declare artifact promotion rules in an `archive.promote` section so `openspec archive` handles post-archive file operations declaratively.

#### Scenario: Schema declares promotion rule for compound
- **WHEN** the avw schema is loaded
- **THEN** `archive.promote` contains an entry with `artifact: compound`
- **THEN** the entry specifies `to` as a path pattern with `{{frontmatter.*}}` and `{{slug}}` template variables
- **THEN** the entry specifies `slug` derivation method
- **THEN** the entry specifies `on_conflict` strategy

#### Scenario: openspec archive executes promotion rules
- **WHEN** `openspec archive --change "<name>"` is run on an avw-schema change
- **THEN** openspec reads `archive.promote` from the schema
- **THEN** for each promotion entry, the artifact file is copied to the resolved `to` path
- **THEN** template variables are resolved from the artifact's YAML frontmatter and derived slug

#### Scenario: Slug derived from H1 title
- **WHEN** a promotion entry has `slug: h1_title`
- **THEN** the first `# ` heading in the artifact is extracted
- **THEN** the heading text is lowercased and non-alphanumeric characters are replaced with hyphens
- **THEN** leading and trailing hyphens are stripped

#### Scenario: Overwrite on conflict
- **WHEN** a promotion entry has `on_conflict: overwrite`
- **THEN** if the resolved target path already exists, the file is overwritten
