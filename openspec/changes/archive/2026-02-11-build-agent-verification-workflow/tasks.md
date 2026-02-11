## 1. Schema Definition

- [x] 1.1 Create `openspec/schemas/verified/schema.yaml` — 6 artifacts (proposal, specs, design, tasks, demo, compound), DAG (proposal → {specs, design} → tasks → {demo, compound}), apply config tracking tasks.md, Entire operational guidance in apply/demo instructions
- [x] 1.2 Validate schema with `openspec schema validate verified`

## 2. Planning Artifact Templates

- [x] 2.1 Create `openspec/schemas/verified/proposal.md` — spec-driven template PLUS required `## Prior Art` section with instructions to search `openspec/solutions/` and mark stale entries
- [x] 2.2 Create `openspec/schemas/verified/specs.md` — same template as spec-driven
- [x] 2.3 Create `openspec/schemas/verified/design.md` — same template as spec-driven
- [x] 2.4 Create `openspec/schemas/verified/tasks.md` — same template as spec-driven

## 3. Demo Artifact Template

- [x] 3.1 Create `openspec/schemas/verified/demo.md` — Showboat construction instructions (init/note/exec/image), Rodney browser steps (start/open/screenshot/ax-tree/stop), Entire attribution capture, showboat verify

## 4. Compound Artifact Template

- [x] 4.1 Create `openspec/schemas/verified/compound.md` — YAML frontmatter (spec_ref, date, problem_type, severity, tags), required sections (Problem, What Didn't Work, Solution, Why This Works, Prevention), new-vs-update decision guidance, existing solutions check instructions

## 5. Solutions Directory

- [x] 5.1 Create `openspec/solutions/.gitkeep` to establish the solutions directory in version control

## 6. Skill Templates

- [x] 6.1 Create `templates/skills/avw-new.md` — prerequisite check (entire, showboat, rodney) + `openspec new change --schema verified` + status display
- [x] 6.2 Create `templates/skills/avw-demo.md` — task completion guard, Showboat construction flow, Rodney integration, Entire attribution, showboat verify
- [x] 6.3 Create `templates/skills/avw-full.md` — end-to-end: prerequisites → new → ff → apply (Entire rewind/status/explain) → demo + compound → verify → archive (with compound → solutions promotion), user confirmation at each stage
- [x] 6.4 Create `templates/commands/avw-new.md`, `templates/commands/avw-demo.md`, `templates/commands/avw-full.md` — OpenCode command wrappers

## 7. Validation

- [x] 7.1 Test schema: create a test change with `--schema verified`, verify 6 artifacts in status
- [x] 7.2 Test DAG: verify demo and compound are blocked until tasks is done
- [x] 7.3 Test proposal instructions: verify Prior Art section in template
- [x] 7.4 Test compound instructions: verify YAML frontmatter, required sections, new-vs-update guidance
- [x] 7.5 Test demo instructions: verify Showboat/Rodney/Entire commands
- [x] 7.6 Clean up test change
