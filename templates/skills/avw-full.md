End-to-end AVW change workflow: prerequisites through archive with solutions promotion.

Each stage requires user confirmation before proceeding. The user can stop at any stage and resume later.

**Stages**

### Stage 1: Prerequisites

Validate all required tools are installed:

```bash
entire --version   # entireio/cli
showboat --version # simonw/showboat >= 0.4.0
rodney --version   # simonw/rodney >= 0.3.0
```

If Entire is not enabled for this project, run `entire enable`.

Stop and report missing tools. Do not proceed without all dependencies.

**→ Ask user to confirm before proceeding to Stage 2.**

### Stage 2: Create Change

```bash
{{openspec_cmd}} new change "<name>" --schema avw
```

Display status showing the 6-artifact DAG.

**→ Ask user to confirm before proceeding to Stage 3.**

### Stage 3: Fast-Forward Artifacts

Create all planning artifacts (proposal → specs + design → tasks) using `/opsx:ff <name>`:

1. Create proposal.md (with Prior Art section — search `openspec/solutions/`)
2. Create specs (one per capability from proposal)
3. Create design.md
4. Create tasks.md

Show status after completion.

**→ Ask user to confirm before proceeding to Stage 4.**

### Stage 4: Apply (Implementation)

Implement tasks from tasks.md. During implementation:

- Run `entire status` at the start of each session
- Use `entire rewind` to recover from bad states
- Use `entire resume` to continue from a previous session
- Use `entire explain` to understand what happened in a previous session

Mark each task complete as you go: `- [ ]` → `- [x]`.

Continue until all tasks are checked or a blocker is hit.

**→ Ask user to confirm before proceeding to Stage 5.**

### Stage 5: Demo + Compound

Create both post-implementation artifacts (can be done in either order):

**Demo:**
1. Verify all tasks are checked in tasks.md
2. `showboat init <change-dir>/demo.md "<name> Verification"`
3. For each feature: `showboat note` + `showboat exec` (or `showboat image` with Rodney for browser features)
4. Capture Entire attribution
5. `showboat verify <change-dir>/demo.md`

**Compound:**
1. Check `openspec/solutions/<spec_ref>/` for existing entries
2. Decide: create new or update existing solution
3. Fill in all required sections: Problem, What Didn't Work, Solution, Why This Works, Prevention
4. Include YAML frontmatter: spec_ref, date, problem_type, severity, tags

**→ Ask user to confirm before proceeding to Stage 6.**

### Stage 6: Verify

Run `/opsx:verify <name>` to validate:
- All artifacts exist and are well-formed
- Specs cover all capabilities from proposal
- Tasks are all checked
- Demo passes `showboat verify`
- Compound has all required sections and valid frontmatter

**→ Ask user to confirm before proceeding to Stage 7.**

### Stage 7: Archive

Archive the change with solutions promotion:

1. Merge delta specs to `openspec/specs/<capability>/spec.md`
2. Promote compound.md to `openspec/solutions/<spec_ref>/<date>-<slug>.md`
   - Slug: H1 title, kebab-cased (e.g., "JWT Session Handling" → `jwt-session-handling`)
   - If updating an existing solution, overwrite the original file
3. Move change directory to `openspec/changes/archive/<name>/`

```bash
{{openspec_cmd}} archive --change "<name>"
```

Manually copy compound.md to solutions if the CLI doesn't handle promotion yet:
```bash
cp <change-dir>/compound.md openspec/solutions/<spec_ref>/<date>-<slug>.md
```

Display final status confirming archive is complete.
