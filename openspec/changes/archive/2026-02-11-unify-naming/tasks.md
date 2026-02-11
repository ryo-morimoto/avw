## 1. Schema Rename

- [x] 1.1 Rename directory `openspec/schemas/verified/` → `openspec/schemas/avw/`
- [x] 1.2 Update `name: verified` → `name: avw` in `openspec/schemas/avw/schema.yaml`
- [x] 1.3 Update `description` in schema.yaml to use `avw` instead of `Verified`
- [x] 1.4 Validate renamed schema with `openspec schema validate avw`

## 2. Main Spec Rename

- [x] 2.1 Rename directory `openspec/specs/verified-schema/` → `openspec/specs/avw-schema/`

## 3. Skill Template References

- [x] 3.1 Update `templates/skills/avw-new.md` — replace `verified` with `avw` in description and `--schema` flag
- [x] 3.2 Update `templates/skills/avw-demo.md` — replace `verified` with `avw` in description
- [x] 3.3 Update `templates/skills/avw-full.md` — replace `verified` with `avw` in description and `--schema` flag
- [x] 3.4 Update `templates/commands/avw-new.md` — replace `verified` with `avw` in description
- [x] 3.5 Update `templates/commands/avw-demo.md` — replace `verified` with `avw` in description
- [x] 3.6 Update `templates/commands/avw-full.md` — replace `verified` with `avw` in description

## 4. Main Spec Content Updates

- [x] 4.1 Update `openspec/specs/avw-schema/spec.md` — replace all `verified` references with `avw`
- [x] 4.2 Update `openspec/specs/compound-artifact/spec.md` — replace `verified` references with `avw`
- [x] 4.3 Update `openspec/specs/agent-skill-orchestration/spec.md` — replace `--schema verified` with `--schema avw`
- [x] 4.4 Update `openspec/specs/solutions-store/spec.md` — replace `verified` references with `avw`

## 5. Active Change Updates

- [x] 5.1 Update `openspec/changes/avw-cli/proposal.md` — replace `verified` schema references with `avw`

## 6. README

- [x] 6.1 Create `README.md` — project name (AVW), acronym explanation (Agent Verification Workflow), overview, dependency list (OpenSpec, Entire, Showboat, Rodney), usage guide

## 7. Verification

- [x] 7.1 Grep for remaining `verified` references outside archive and change artifacts — confirm none are stale
- [x] 7.2 Validate schema: `openspec schema validate avw`
- [x] 7.3 Test: create a change with `--schema avw`, verify 6 artifacts in status, clean up
