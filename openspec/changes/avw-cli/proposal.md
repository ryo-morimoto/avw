## Why

The `verified` schema (see change: `build-agent-verification-workflow`) defines a workflow combining OpenSpec + Entire + Showboat/Rodney. But adopting it in a project requires manual steps: copy schema files, generate skills for each coding tool, validate 5 system dependencies, enable Entire. This friction prevents adoption. An npm CLI package makes setup a single command: `npx avw init`.

## What Changes

- Create an npm package (`@opsx-compound/avw` or similar) at `packages/avw-cli/`
- `avw init`: validate dependencies (openspec, entire, showboat, rodney, Chrome) → check openspec initialized → copy verified schema → detect coding tools (.claude, .codex, .opencode) → generate skills → enable Entire → print summary
- `avw update`: re-generate skills + update schema from latest package version, skip Entire config
- Schema and skill templates are bundled as static assets in the npm package

### Dependency on `verified-schema` change

This change depends on the `verified-schema` schema definition and templates being finalized first. The CLI bundles and distributes those files.

### CLI design questions to resolve in design.md

- Argument parsing: process.argv direct vs lightweight framework (commander, citty)
- Build tooling: tsup, tsc, or unbuild for TypeScript → JS
- Output formatting: colors (chalk/picocolors), spinners (ora/nanospinner), or plain text
- Dependency validation: parallel `child_process.exec` calls with result aggregation
- Template rendering: simple `{{var}}` string replacement vs templating library
- Package scope and naming
- Minimum Node.js version

## Capabilities

### New Capabilities
- `setup-cli`: npm package with `avw init` and `avw update` commands for one-command workflow adoption in any project

### Modified Capabilities

## Impact

- **New files**: `packages/avw-cli/` — TypeScript package with bin entry, schema bundle, skill templates
- **Dependencies**: Node.js >= 20, TypeScript (dev), minimal runtime deps TBD
- **Peer dependencies**: `@fission-ai/openspec` (system), `entireio/cli` (system), `showboat` (system), `rodney` (system)
- **No breaking changes**: Standalone package, does not modify existing project files except generating new skill files in tool directories

### Expected `avw init` output

```
$ npx avw init

Checking dependencies...
  ✓ openspec 1.1.1
  ✓ entire (enabled)
  ✓ showboat 0.4.0
  ✓ rodney 0.3.0
  ✓ Chrome detected

Installing verified schema...
  → openspec/schemas/verified/ (6 artifacts)

Detecting coding tools...
  ✓ Claude Code (.claude/)
  ✓ Codex (.codex/)
  ✓ OpenCode (.opencode/)

Generating skills...
  → .claude/skills/avw-{new,demo,full}/SKILL.md
  → .codex/skills/avw-{new,demo,full}/SKILL.md
  → .opencode/skills/avw-{new,demo,full}/SKILL.md
  → .opencode/command/avw-{new,demo,full}.md

Entire: already enabled

Done! Start a verified change with /avw:new
```

### Expected failure output

```
$ npx avw init

Checking dependencies...
  ✓ openspec 1.1.1
  ✗ entire not found
  ✗ showboat not found
  ✓ rodney 0.3.0
  ✓ Chrome detected

Missing dependencies:
  entire:   brew install entireio/tap/entire  (or: curl -fsSL https://entire.io/install.sh | bash)
  showboat: pip install showboat              (or: uvx showboat)

Fix the above and run 'avw init' again.
```
