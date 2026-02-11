## Context

The AVW schema is defined at `openspec/schemas/avw/` with 6 artifacts and supporting templates. Skill templates (`templates/skills/avw-{new,demo,full}.md`) and OpenCode command templates (`templates/commands/avw-{new,demo,full}.md`) already exist in the repo. The project has three coding tool directories at the root: `.claude/`, `.codex/`, `.opencode/`.

Currently, adopting AVW in a new project requires manually copying schema files, generating skills for each tool, validating 5 system dependencies, and enabling Entire. The CLI automates this into `avw init` and `avw update`.

## Goals / Non-Goals

**Goals:**
- Single-command AVW setup via `npx avw init`
- Schema + skill refresh via `avw update`
- Clear dependency validation with actionable install instructions on failure
- Zero runtime dependencies beyond Node.js built-ins where possible

**Non-Goals:**
- Interactive prompts or wizard-style setup (init is opinionated, not configurable)
- Managing OpenSpec changes or running the AVW workflow (that's OpenSpec CLI + skills)
- Auto-installing missing dependencies (the CLI reports, user installs)
- Supporting non-npm distribution (e.g., standalone binary via pkg/bun compile)

## Decisions

### Package name and scope: `avw`
Publish as `avw` (unscoped). The name is short, matches the binary name, and avoids tying the package to an org that may change. If `avw` is taken on npm, fall back to `@anthropic/avw`.

**Alternative considered:** `@opsx-compound/avw` — adds org coupling, longer `npx` invocation.

### Argument parsing: `process.argv` direct
The CLI has exactly two subcommands (`init`, `update`) with no flags. A framework like commander or citty adds a dependency for no benefit. Parse `process.argv[2]` directly with a switch statement.

**Alternative considered:** `citty` — lightweight but still a dependency for a 2-command CLI.

### Build tooling: `tsup`
Use `tsup` to bundle TypeScript to a single ESM file. It handles shebang injection, tree-shaking, and produces a single `dist/cli.mjs` with no runtime dependencies. The `package.json` `bin` field points to this output.

**Alternative considered:** `tsc` — requires shipping multiple files and a separate shebang step. `unbuild` — heavier config surface.

### Output formatting: `picocolors` only
Use `picocolors` (3.5 KB, zero deps) for ANSI colors. No spinners — the CLI runs fast enough that spinners add visual noise without value. Use Unicode checkmarks (`✓`/`✗`) directly. Format output with simple `console.log` calls.

**Alternative considered:** `chalk` — larger, same API surface for this use case. `ora` — spinners unnecessary for sub-second operations.

### Dependency validation: sequential `child_process.execSync`
Check each dependency with `execSync` calling `which <tool>` and `<tool> --version`. Sequential is simpler than parallel and the total time for 5 checks is negligible (<500ms). Wrap each check in try/catch to detect missing binaries.

Chrome detection: check for `google-chrome`, `chromium`, `chromium-browser` in PATH, then fall back to platform-specific paths (`/Applications/Google Chrome.app/...` on macOS).

**Alternative considered:** Parallel `exec` with Promise.all — more complex, saves <200ms.

### Template rendering: `{{var}}` string replacement
Skill templates use `{{schemaName}}` style placeholders. Replace with `String.prototype.replaceAll()` (available in Node 20+). No templating library needed.

**Alternative considered:** `mustache`, `handlebars` — overkill for simple variable interpolation.

### Bundled assets: copy from source tree at build time
The schema files (`openspec/schemas/avw/`) and templates (`templates/`) are copied into `packages/avw-cli/assets/` during the build step via a tsup `onSuccess` hook or a prebuild script. At runtime, the CLI resolves assets relative to `import.meta.url`.

This avoids git submodules or fetching assets at install time.

### Entire enablement: `entire enable` CLI call
Run `execSync('entire enable')` and check the exit code. If it succeeds or if `entire status` reports already enabled, proceed. The CLI does not configure Entire beyond enabling it.

### Project structure

```
packages/avw-cli/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── src/
│   ├── cli.ts              # Entry point: arg parsing, subcommand dispatch
│   ├── commands/
│   │   ├── init.ts          # avw init implementation
│   │   └── update.ts        # avw update implementation
│   ├── steps/
│   │   ├── check-node.ts    # Node.js version gate
│   │   ├── check-deps.ts    # Dependency validation
│   │   ├── check-openspec.ts # OpenSpec init check
│   │   ├── install-schema.ts # Copy schema files
│   │   ├── detect-tools.ts  # Coding tool detection
│   │   ├── generate-skills.ts # Skill file generation
│   │   └── enable-entire.ts # Entire enablement
│   └── util/
│       ├── exec.ts          # execSync wrapper with error handling
│       ├── log.ts           # Colored output helpers (✓/✗ prefixes)
│       └── paths.ts         # Asset path resolution via import.meta.url
└── assets/                  # Populated at build time
    ├── schema/              # Copy of openspec/schemas/avw/
    └── templates/           # Copy of templates/
```

### Execution flow

**`avw init`:**
1. `check-node` — verify Node.js >= 20, exit if not
2. `check-deps` — validate all 5 dependencies, collect results, exit if any missing
3. `check-openspec` — verify `openspec/` directory exists in cwd
4. `install-schema` — copy `assets/schema/` to `openspec/schemas/avw/`
5. `detect-tools` — scan for `.claude/`, `.codex/`, `.opencode/`
6. `generate-skills` — for each detected tool, render and write skill files
7. `enable-entire` — run `entire enable` if not already enabled
8. Print summary

**`avw update`:**
1. `install-schema` — overwrite schema files
2. `detect-tools` — scan for tool directories
3. `generate-skills` — regenerate skill files
4. Print summary

### Minimum Node.js version: 20
Node 20 is the current LTS (active support). It provides `String.replaceAll()`, stable `fs/promises`, `import.meta.url`, and `node:` protocol imports. Enforce via an `engines` field in package.json and a runtime check at CLI entry.

## Risks / Trade-offs

**[Risk] Bundled schema diverges from source** — The npm package bundles a snapshot of the schema at publish time. If the schema is updated in the repo but the package isn't republished, users get stale files.
→ Mitigation: The `avw update` command exists specifically for this. Document that schema updates require a new package version. CI can enforce that schema changes trigger a package version bump.

**[Risk] Entire CLI interface changes** — The CLI calls `entire enable` and `entire status` directly. If Entire changes its CLI interface, the avw CLI breaks.
→ Mitigation: Wrap Entire calls in a single `enable-entire.ts` step. Pin to known Entire CLI behavior and update when needed.

**[Risk] Chrome detection is fragile** — Chromium-based browsers install to different paths across OS and distro.
→ Mitigation: Check multiple known binary names and paths. Accept false negatives (user can `--skip-chrome` in a future version if needed). Chrome is only required for the demo artifact, not for init to succeed — consider making it a warning rather than a hard failure.

**[Trade-off] No interactive mode** — The CLI is fully non-interactive. Users cannot select which tools to generate skills for or skip steps.
→ Rationale: Simplicity. The CLI does one thing end-to-end. Users who want partial setup can run individual steps manually. A future `--only` flag could be added if needed.
