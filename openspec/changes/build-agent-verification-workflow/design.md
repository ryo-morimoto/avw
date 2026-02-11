## Context

This project has OpenSpec v1.1.1 initialized. The existing `spec-driven` schema provides: `proposal → specs + design → tasks → apply → verify → archive`.

Three external tools are **required dependencies** of the `verified` schema:
- **Entire** (entireio/cli): Git shadow branches for session persistence. Records automatically via hooks. Agents use `entire rewind`, `entire explain`, `entire resume` during development.
- **Showboat** (simonw/showboat v0.4.0): Executable demo documents. Commands: `init`, `note`, `exec`, `image`, `pop`, `verify`, `extract`.
- **Rodney** (simonw/rodney v0.3.0): Chrome automation. Commands: `start`, `stop`, `open`, `js`, `click`, `screenshot`, `ax-tree`, etc.

This change creates the schema and templates. Distribution to other projects is handled by the `avw-cli` change.

## Goals / Non-Goals

**Goals:**
- Define the `verified` schema with 5 artifacts (proposal, specs, design, tasks, demo)
- Write Showboat/Rodney-native instructions for the demo artifact
- Embed Entire operational guidance in apply/demo instructions
- Create canonical skill templates for distribution

**Non-Goals:**
- npm package / CLI tool — handled by `avw-cli` change
- Skill file generation logic — handled by `avw-cli` change
- Tool detection and dependency validation — handled by `avw-cli` change
- Session recording artifact — Entire handles this automatically

## Decisions

### 1. Custom schema (`verified`) with 5 artifacts

**Decision**: Fork `spec-driven` into a new schema adding `demo` after `tasks`.

```
proposal → specs + design → tasks → demo
```

**Rationale**: OpenSpec's DAG doesn't support optional nodes or schema inheritance. A new schema gives full control without affecting existing workflows.

### 2. Demo: Showboat-native executable document

**Decision**: The demo artifact is constructed entirely via Showboat CLI. Agents MUST NOT edit demo.md directly.

**Showboat workflow**:
```bash
showboat init demo.md "<change-name> Verification"
showboat note demo.md "Verifying <feature>"
showboat exec demo.md bash '<verification-command>'
# Browser features:
rodney start && rodney open <url>
showboat image demo.md 'rodney screenshot /tmp/shot.png && echo /tmp/shot.png'
rodney stop
# Reproducibility:
showboat verify demo.md
```

**Rationale**: Showboat prevents agents from fabricating evidence. `exec` captures real output. `verify` re-runs all blocks. `image` integrates with Rodney screenshots.

### 3. Entire as infrastructure, not artifact

**Decision**: No `session` artifact. Entire records automatically via hooks. Operational guidance embedded in schema instructions.

**Apply instruction includes**: `entire status`, `entire rewind`, `entire resume <branch>`
**Demo instruction includes**: `git log --format='%(trailers:key=Entire-Attribution)' -5` for attribution capture

### 4. Reuse spec-driven templates for planning artifacts

**Decision**: proposal, specs, design, tasks templates are identical to spec-driven. Only demo is new.

**Rationale**: No reason to diverge on planning artifacts. The value is in the demo artifact and Entire guidance additions.

### 5. Skill templates as canonical files

**Decision**: Skill templates live alongside the schema as standalone markdown files. The `avw-cli` package reads and distributes them. Templates use `{{variable}}` for tool-specific values.

**Template list**:
- `avw-new.md` — prerequisite check + `openspec new change --schema verified`
- `avw-demo.md` — task completion guard + Showboat/Rodney construction flow
- `avw-full.md` — end-to-end orchestration with Entire operational guidance

## Risks / Trade-offs

**[Agent compliance]** Showboat's CLI-only construction prevents fabrication. `showboat verify` re-runs all code blocks.

**[DAG ordering]** Demo can be created before `apply` completes since DAG depends on `tasks` artifact, not `apply` action. → Instructions guard against this; `showboat exec` captures real state.

**[Schema coupling]** OpenSpec schema format changes. → Pin to schema format v1.
