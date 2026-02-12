## 1. Schema update

- [ ] 1.1 Add `archive.promote` section to `openspec/schemas/avw/schema.yaml` with compound promotion entry
- [ ] 1.2 Verify schema.yaml is valid YAML after edit

## 2. Skill template update

- [ ] 2.1 Update `templates/skills/avw-full.md` Stage 7 to remove manual `cp` fallback and reference `archive.promote`

## 3. Spec updates

- [ ] 3.1 Add "Archive promotion configuration" requirement to `openspec/specs/avw-schema/spec.md`
- [ ] 3.2 Update "Archive promotes compound to solutions" requirement in `openspec/specs/compound-artifact/spec.md`
- [ ] 3.3 Update "avw-full includes compound step" requirement in `openspec/specs/agent-skill-orchestration/spec.md`

## 4. Build verification

- [ ] 4.1 Run `bun run build.ts` in `packages/avw-cli/` to confirm schema with `archive` section builds correctly
