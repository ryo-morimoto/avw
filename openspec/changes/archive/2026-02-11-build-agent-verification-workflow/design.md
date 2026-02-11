## Context

This project has OpenSpec v1.1.1 initialized. The existing `spec-driven` schema provides: `proposal → specs + design → tasks → apply → verify → archive`.

Three external tools are **required dependencies**:
- **Entire** (entireio/cli): Git shadow branches for session persistence. Records automatically via hooks. Agents use `entire rewind`, `entire explain`, `entire resume` during development.
- **Showboat** (simonw/showboat v0.4.0): Executable demo documents. Commands: `init`, `note`, `exec`, `image`, `pop`, `verify`, `extract`.
- **Rodney** (simonw/rodney v0.3.0): Chrome automation. Commands: `start`, `stop`, `open`, `js`, `click`, `screenshot`, `ax-tree`, etc.

The compound-engineering workflow (`/workflows:compound`) produces `docs/solutions/` entries with structured YAML frontmatter. We adopt this pattern but relocate the store to `openspec/solutions/` and enforce recording/referencing structurally.

## Goals / Non-Goals

**Goals:**
- Define the `verified` schema with 6 artifacts (proposal, specs, design, tasks, demo, compound)
- Structurally guarantee knowledge recording: compound artifact blocks archive
- Structurally guarantee knowledge referencing: proposal template requires Prior Art section
- Curated knowledge persists in `openspec/solutions/<spec_ref>/` after archive
- Git-based freshness tracking (solution.date vs spec last-modified)
- Showboat/Rodney-native demo artifact, Entire operational guidance

**Non-Goals:**
- npm package / CLI tool — handled by `avw-cli` change
- Automated freshness checking CLI — future enhancement for `avw-cli`
- Replacing `/workflows:compound` — we adopt its output format and knowledge structure, adapted for OpenSpec
- Session recording artifact — Entire handles this automatically

## Decisions

### 1. Custom schema (`verified`) with 6 artifacts

**Decision**: Fork `spec-driven` into a new schema with `demo` and `compound` after `tasks`.

```
proposal → specs + design → tasks → demo + compound
```

`demo` and `compound` depend on `tasks`, can be created in parallel. Both must be complete before archive.

**Rationale**: Two distinct post-implementation concerns — proving it works (demo) and capturing what was learned (compound). Neither should block the other. Both must exist before archive to guarantee the workflow's value.

### 2. Compound artifact: structural enforcement of knowledge recording

**Decision**: `compound` is a required DAG artifact, not an optional instruction. Changes with the `verified` schema cannot be archived without `compound.md`.

**compound.md structure**:
```yaml
---
spec_ref: auth
date: 2026-02-11
problem_type: runtime_error
severity: medium
tags: [jwt, session, token-refresh]
---
```
```markdown
# [Clear title describing the knowledge]

## Problem
[What was encountered]

## What Didn't Work
[Approaches tried and why they failed]

## Solution
[What worked, with code examples]

## Why This Works
[Root cause understanding]

## Prevention
[How to avoid in future]
```

**Rationale**: "Add to instructions" is advisory — agents skip it. Making it an artifact means OpenSpec's DAG tracks it, `openspec status` shows it, and archive requires it. The compound-engineering principle ("document so next time takes minutes") becomes structural, not cultural.

**YAML frontmatter fields** (adapted from compound-engineering schema):
- `spec_ref` (required): capability name matching `openspec/specs/<name>/`. Links knowledge to spec for freshness tracking.
- `date` (required): ISO 8601 date
- `problem_type` (required): build_error, runtime_error, workflow_issue, best_practice, etc.
- `severity` (required): critical, high, medium, low
- `tags` (optional): searchable keywords

### 3. Proposal template: structural enforcement of knowledge referencing

**Decision**: The `verified` schema's proposal template includes a required `## Prior Art` section:

```markdown
## Prior Art

<!-- REQUIRED: Search openspec/solutions/ for entries related to your target capabilities.
     List relevant solutions with links, or state "No relevant solutions found."
     Run: ls openspec/solutions/<capability>/ for each capability in scope. -->

- [solution-name](../../solutions/<capability>/<file>.md) — <what it covers>
```

**Rationale**: If knowledge referencing is not in the template, agents won't do it. A required section means the agent must engage with `openspec/solutions/` during proposal creation. Empty or boilerplate answers are visible in review.

### 4. Solutions store at `openspec/solutions/`

**Decision**: Knowledge base lives at `openspec/solutions/<capability>/`, not `docs/solutions/`.

```
openspec/
  specs/auth/spec.md              # What auth does (source of truth)
  solutions/auth/                  # What we learned about auth
    2026-02-11-jwt-session.md
    2026-02-08-oauth-redirect.md
  changes/add-auth/               # Active change
    compound.md                    # → becomes a solutions/ entry on archive
```

**Rationale**: Specs and solutions share the capability namespace. When you modify `auth`, relevant learnings are in the same hierarchy. `docs/solutions/` (compound-engineering default) separates knowledge from specs — we want them together.

### 5. Archive promotes compound to solutions

**Decision**: During archive, `compound.md` is copied to `openspec/solutions/<spec_ref>/<date>-<slug>.md`. This mirrors how delta specs merge to `openspec/specs/`.

```
Archive process:
1. Delta specs → openspec/specs/<capability>/spec.md  (existing)
2. compound.md → openspec/solutions/<spec_ref>/<date>-<slug>.md  (new)
3. Change dir → openspec/changes/archive/  (existing)
```

**Rationale**: The change directory is ephemeral (archived). Knowledge must persist outside it. The solutions directory is the permanent store. The archive step is the natural promotion point.

**Slug generation**: from compound.md's H1 title, kebab-cased. Example: `# JWT Session Handling` → `2026-02-11-jwt-session-handling.md`.

### 6. Freshness tracking via git

**Decision**: A solution is STALE when `solution.date < last commit date of openspec/specs/<spec_ref>/spec.md`.

**Detection**: `git log -1 --format='%ci' -- openspec/specs/<spec_ref>/spec.md` gives the spec's last modification date. Compare against solution frontmatter `date`. No additional metadata needed.

**Surfacing**: During proposal creation (Prior Art section), the agent lists solutions and marks stale ones. This is instruction-guided, not automated — the template says:
```
For each solution, check if the referenced spec has been modified since the solution date.
Mark stale solutions with [STALE].
```

Future: `avw doctor` command automates this check (in `avw-cli` change).

### 7. Compound creation: new vs update existing

**Decision**: When creating compound.md, the agent checks `openspec/solutions/<spec_ref>/` for existing entries. If related solutions exist:
- If the new knowledge supersedes an existing solution → update the existing file (copy to change dir, modify, archive overwrites)
- If the new knowledge is distinct → create a new entry

**Rationale**: Without this, the solutions directory grows unboundedly with duplicates. The compound template instruction guides this decision.

### 8. Demo: Showboat-native (unchanged)

Same as before: `showboat init/note/exec/image/verify` with `rodney` for browser automation. Agents MUST NOT edit demo.md directly.

### 9. Entire as infrastructure (unchanged)

No session artifact. Entire records via hooks. Operational guidance (`rewind`, `status`, `explain`, `resume`) in apply/demo instructions.

### 10. Skill templates as canonical files (updated)

Three skill templates, updated for compound:
- `avw-new.md` — prerequisite check + `openspec new change --schema verified`
- `avw-demo.md` — task completion guard + Showboat/Rodney construction
- `avw-full.md` — end-to-end: prerequisites → new → ff → apply (Entire guidance) → demo + compound → verify → archive (with solutions promotion)

## Risks / Trade-offs

**[Compound quality]** Agents might produce low-quality compound entries to satisfy the requirement. → Mitigation: verify step checks compound.md has all required sections. Review catches boilerplate.

**[Solutions growth]** Over time, `openspec/solutions/` accumulates many entries. → Mitigation: organized by capability; stale entries are flagged and can be pruned during review.

**[Agent compliance - demo]** Showboat CLI-only construction prevents fabrication. `showboat verify` re-runs all blocks.

**[DAG ordering]** Demo and compound can be created before apply completes. → Instructions guard against this.

**[Schema coupling]** OpenSpec schema format changes. → Pin to schema format v1.

**[Archive complexity]** Archive now has an extra step (compound → solutions promotion). → The `avw:full` skill handles this. Manual archive via `/opsx:archive` would need enhancement or documentation.
