## 1. Schema Definition

- [ ] 1.1 Create `openspec/schemas/verified/schema.yaml` — 5 artifacts (proposal, specs, design, tasks, demo), DAG (proposal → {specs, design} → tasks → demo), apply config tracking tasks.md, Entire operational guidance in apply/demo instructions
- [ ] 1.2 Validate schema with `openspec schema validate verified`

## 2. Planning Artifact Templates (reuse spec-driven)

- [ ] 2.1 Create `openspec/schemas/verified/proposal.md` — same template as spec-driven
- [ ] 2.2 Create `openspec/schemas/verified/specs.md` — same template as spec-driven
- [ ] 2.3 Create `openspec/schemas/verified/design.md` — same template as spec-driven
- [ ] 2.4 Create `openspec/schemas/verified/tasks.md` — same template as spec-driven

## 3. Demo Artifact Template

- [ ] 3.1 Create `openspec/schemas/verified/demo.md` — Showboat construction instructions (init/note/exec/image), Rodney browser steps (start/open/screenshot/ax-tree/stop), Entire attribution capture, showboat verify for reproducibility

## 4. Skill Templates

- [ ] 4.1 Create `templates/skills/avw-new.md` — prerequisite check (entire, showboat, rodney) + `openspec new change --schema verified` + status display
- [ ] 4.2 Create `templates/skills/avw-demo.md` — task completion guard, Showboat construction flow, Rodney integration, Entire attribution, showboat verify
- [ ] 4.3 Create `templates/skills/avw-full.md` — end-to-end orchestration: prerequisites → new → ff → apply (Entire rewind/status/explain) → demo (Showboat + Rodney) → verify → archive, user confirmation at each stage
- [ ] 4.4 Create `templates/commands/avw-new.md`, `templates/commands/avw-demo.md`, `templates/commands/avw-full.md` — OpenCode command wrappers

## 5. Validation

- [ ] 5.1 Test schema: create a test change with `--schema verified`, verify 5 artifacts in status
- [ ] 5.2 Test DAG: verify demo is blocked until tasks is done
- [ ] 5.3 Test demo instructions: verify Showboat/Rodney/Entire commands in output
- [ ] 5.4 Test apply instructions: verify Entire operational guidance in output
- [ ] 5.5 Clean up test change
