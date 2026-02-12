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

### Package name: `avw`
Publish as `avw` (unscoped). Short, matches the binary name, and enables the clean `npx avw init` invocation. If `avw` is unavailable on npm, fall back to `avw-cli`.

**Alternative considered:** `@opsx-compound/avw` — adds org coupling, longer `npx` invocation.

### Argument parsing: `util.parseArgs`
Use Node.js built-in `util.parseArgs` (stable since Node 20, also available in Bun). It handles positional arguments and flags with zero dependencies and a clean API:

```ts
import { parseArgs } from "node:util";

const { positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  strict: true,
});

const command = positionals[0]; // "init" | "update"
```

This is more structured than raw `process.argv[2]` while remaining dependency-free.

**Alternative considered:** `process.argv` direct — works but fragile if flags are ever added. `commander`/`citty` — unnecessary external dependency.

### Build tooling: `bun build`
Use `bun build` to bundle TypeScript to a single ESM file targeting Node.js. Bun's bundler is fast, handles tree-shaking and TypeScript natively, and requires no additional dev dependencies beyond Bun itself.

```bash
bun build src/cli.ts --outdir dist --target node --format esm --minify
```

A `build.ts` script handles the shebang injection and asset copying:

```ts
await Bun.build({
  entrypoints: ["./src/cli.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  minify: true,
});
```

The `package.json` `bin` field points to `dist/cli.js`. A prebuild script copies schema and template assets into `assets/`.

**Alternative considered:** `tsup` — adds a dev dependency for functionality Bun provides natively. `tsc` — requires shipping multiple files and a separate shebang step.

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
The schema files (`openspec/schemas/avw/`) and templates (`templates/`) are copied into `packages/avw-cli/assets/` during the build step via a prebuild script. At runtime, the CLI resolves assets relative to `import.meta.url`.

This avoids git submodules or fetching assets at install time.

### Entire enablement: `entire enable` CLI call
Run `execSync('entire enable')` and check the exit code. If it succeeds or if `entire status` reports already enabled, proceed. The CLI does not configure Entire beyond enabling it.

### Project structure

```
packages/avw-cli/
├── package.json
├── tsconfig.json
├── build.ts                # Bun build script
├── src/
│   ├── cli.ts              # Entry point: parseArgs, subcommand dispatch
│   ├── commands/
│   │   ├── init.ts         # init workflow orchestration
│   │   └── update.ts       # update workflow orchestration
│   ├── core/
│   │   ├── validation.ts   # Node/deps/OpenSpec checks (unified)
│   │   ├── schema.ts       # Schema installation
│   │   ├── skills.ts       # Tool detection + skill generation (unified)
│   │   └── entire.ts       # Entire integration
│   └── util/
│       ├── exec.ts         # execSync wrapper with error handling
│       ├── log.ts          # Colored output helpers (✓/✗ prefixes)
│       └── paths.ts        # Asset path resolution via import.meta.url
└── assets/                 # Populated at build time
    ├── schema/             # Copy of openspec/schemas/avw/
    └── templates/          # Copy of templates/
```

Domain-centered grouping under `core/` keeps related logic together:
- `validation.ts` — all check logic (Node version, system deps, OpenSpec init) in one place
- `skills.ts` — tool detection and skill generation unified, high cohesion
- `schema.ts` — schema file copy logic
- `entire.ts` — Entire enable/status logic

### Execution flow

**`avw init`:**
1. `validation.checkNode()` — verify Node.js >= 20, exit if not
2. `validation.checkDeps()` — validate all 5 dependencies, collect results, exit if any missing
3. `validation.checkOpenSpec()` — verify `openspec/` directory exists in cwd
4. `schema.install()` — copy `assets/schema/` to `openspec/schemas/avw/`
5. `skills.detect()` — scan for `.claude/`, `.codex/`, `.opencode/`
6. `skills.generate()` — for each detected tool, render and write skill files
7. `entire.enable()` — run `entire enable` if not already enabled
8. Print summary

**`avw update`:**
1. `schema.install()` — overwrite schema files
2. `skills.detect()` — scan for tool directories
3. `skills.generate()` — regenerate skill files
4. Print summary

### Minimum Node.js version: 20
Node 20 is the current LTS (active support). It provides `util.parseArgs`, `String.replaceAll()`, stable `fs/promises`, `import.meta.url`, and `node:` protocol imports. Enforce via an `engines` field in package.json and a runtime check at CLI entry.

## Risks / Trade-offs

**[Risk] Bundled schema diverges from source** — The npm package bundles a snapshot of the schema at publish time. If the schema is updated in the repo but the package isn't republished, users get stale files.
→ Mitigation: The `avw update` command exists specifically for this. Document that schema updates require a new package version. CI can enforce that schema changes trigger a package version bump.

**[Risk] Entire CLI interface changes** — The CLI calls `entire enable` and `entire status` directly. If Entire changes its CLI interface, the avw CLI breaks.
→ Mitigation: Wrap Entire calls in a single `entire.ts` module. Pin to known Entire CLI behavior and update when needed.

**[Risk] Chrome detection is fragile** — Chromium-based browsers install to different paths across OS and distro.
→ Mitigation: Check multiple known binary names and paths. Accept false negatives (user can `--skip-chrome` in a future version if needed). Chrome is only required for the demo artifact, not for init to succeed — consider making it a warning rather than a hard failure.

**[Risk] Bun as build dependency** — Using `bun build` requires contributors to have Bun installed for development. Users consuming the published npm package are unaffected (they get the pre-built output).
→ Mitigation: Bun is a single binary install (`curl -fsSL https://bun.sh/install | bash`). The project already targets a developer audience comfortable with tooling setup. Document Bun as a dev prerequisite in CONTRIBUTING.

**[Trade-off] No interactive mode** — The CLI is fully non-interactive. Users cannot select which tools to generate skills for or skip steps.
→ Rationale: Simplicity. The CLI does one thing end-to-end. Users who want partial setup can run individual steps manually. A future `--only` flag could be added if needed.
