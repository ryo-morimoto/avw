## 1. Package scaffold

- [x] 1.1 Create `packages/avw-cli/` directory with `package.json` (name: `avw`, bin: `avw` → `dist/cli.js`, engines: `node >=20`, type: `module`)
- [x] 1.2 Create `tsconfig.json` with strict mode, ESM, Node 20 target
- [x] 1.3 Create `build.ts` with `Bun.build()` config (target: node, format: esm, minify, `loader: { ".md": "text" }`, banner with shebang)
- [x] 1.4 Add TypeScript type declarations for `.yaml` and `.md` imports (`src/types.d.ts`)

## 2. Utility modules

- [x] 2.1 Implement `src/util/exec.ts` — `execSync` wrapper that returns `{ ok, stdout, stderr }` instead of throwing
- [x] 2.2 Implement `src/util/log.ts` — colored output helpers using `picocolors` (`success()`, `error()`, `info()`, `warn()` with `✓`/`✗` prefixes)

## 3. Core domain modules

- [x] 3.1 Implement `src/core/validation.ts` — `checkNode()`: compare `process.versions.node` against `>=20`, exit with error if unsupported
- [x] 3.2 Implement `src/core/validation.ts` — `checkDeps()`: validate `openspec`, `entire`, `showboat`, `rodney`, Chrome via `which` + `--version`, return results array, print install instructions for missing deps
- [x] 3.3 Implement `src/core/validation.ts` — `checkOpenSpec()`: verify `openspec/` directory exists in cwd via `fs.existsSync`
- [x] 3.4 Implement `src/core/schema.ts` — `install()`: write embedded schema.yaml and all template .md files to `openspec/schemas/avw/` (create dirs as needed, overwrite if exists)
- [x] 3.5 Implement `src/core/skills.ts` — `detect()`: scan cwd for `.claude/`, `.codex/`, `.opencode/` directories, return list of detected tools
- [x] 3.6 Implement `src/core/skills.ts` — `generate()`: for each detected tool, render skill templates with `{{var}}` replacement and write to correct paths (`.claude/skills/avw-{new,demo,full}/SKILL.md`, etc.), add `.opencode/command/` files for OpenCode
- [x] 3.7 Implement `src/core/entire.ts` — `enable()`: run `entire status` to check, run `entire enable` if needed, print result

## 4. Command orchestration

- [x] 4.1 Implement `src/commands/init.ts` — orchestrate full init flow: checkNode → checkDeps → checkOpenSpec → schema.install → skills.detect → skills.generate → entire.enable → print summary
- [x] 4.2 Implement `src/commands/update.ts` — orchestrate update flow: schema.install → skills.detect → skills.generate → print summary (skip validation and Entire)

## 5. CLI entry point

- [x] 5.1 Implement `src/cli.ts` — parse args with `util.parseArgs`, dispatch to init/update commands, print usage on unknown subcommand or `--help`, exit non-zero on errors

## 6. Build and verify

- [x] 6.1 Run `bun run build.ts` and verify single `dist/cli.js` output with embedded assets
- [x] 6.2 Test `node dist/cli.js --help` prints usage
- [x] 6.3 Test `node dist/cli.js init` in a project with `openspec/` directory — verify schema files written, tools detected, skills generated
- [x] 6.4 Test `node dist/cli.js init` in a project without `openspec/` — verify error message and non-zero exit
- [x] 6.5 Test `node dist/cli.js update` — verify schema overwritten and skills regenerated
- [x] 6.6 Test `node dist/cli.js foobar` — verify unknown subcommand error
