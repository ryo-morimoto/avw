# AVW

**AVW** — Agent Verification Workflow.

A custom [OpenSpec](https://github.com/Fission-AI/OpenSpec) schema that extends spec-driven development with visual proof-of-work and knowledge capture. Agents don't just pass tests — they prove their work and compound what they learn.

## Schema

The `avw` schema adds two post-implementation artifacts to the standard spec-driven workflow:

```
proposal → specs + design → tasks → demo + compound
```

| Artifact | Purpose |
|---|---|
| `proposal` | Why this change is needed, with Prior Art referencing `openspec/solutions/` |
| `specs` | What the system should do (testable requirements) |
| `design` | How to implement it (architecture decisions) |
| `tasks` | Implementation checklist |
| `demo` | Visual proof via [Showboat](https://github.com/simonw/showboat) + [Rodney](https://github.com/simonw/rodney) |
| `compound` | Knowledge extraction promoted to `openspec/solutions/` on archive |

## Dependencies

| Tool | Purpose |
|---|---|
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) >= 1.1.1 | Spec-driven development framework |
| [Entire](https://entire.io) | Git shadow branches for session persistence |
| [Showboat](https://github.com/simonw/showboat) >= 0.4.0 | Executable demo documents |
| [Rodney](https://github.com/simonw/rodney) >= 0.3.0 | Chrome automation for browser verification |

## Usage

```bash
# Create a new change with the avw schema
openspec new change "my-feature" --schema avw

# Step through artifacts
# /opsx:continue my-feature   (or use the CLI directly)

# Implement tasks
# /opsx:apply my-feature

# Archive with spec sync and solutions promotion
# /opsx:archive my-feature
```

## License

MIT
