## ADDED Requirements

### Requirement: Demo artifact is a Showboat document
The demo artifact SHALL be constructed entirely via Showboat CLI commands (`showboat init`, `showboat note`, `showboat exec`, `showboat image`). Agents MUST NOT edit demo.md directly.

#### Scenario: Demo initialization
- **WHEN** an agent creates the demo artifact for a change
- **THEN** `showboat init <change-dir>/demo.md "<change-name> Verification"` is executed
- **THEN** the resulting file contains an H1 title and ISO 8601 timestamp

#### Scenario: Command verification step
- **WHEN** an agent adds a verification step for a CLI/API feature
- **THEN** `showboat exec <change-dir>/demo.md bash '<command>'` is executed
- **THEN** the real command output is captured in an `output` fenced code block
- **THEN** the agent adds a `showboat note` before each exec explaining what is being verified

#### Scenario: Browser verification step with Rodney
- **WHEN** an agent verifies a UI/web feature
- **THEN** `rodney start` launches headless Chrome
- **THEN** `rodney open <url>` navigates to the target page
- **THEN** `showboat image <change-dir>/demo.md 'rodney screenshot /tmp/<name>.png && echo /tmp/<name>.png'` captures a screenshot as evidence
- **THEN** `rodney stop` shuts down Chrome after all browser steps

#### Scenario: Reproducibility verification
- **WHEN** the demo artifact is complete
- **THEN** `showboat verify <change-dir>/demo.md` is executed
- **THEN** all code blocks are re-run and outputs compared
- **THEN** exit code 0 confirms reproducibility

### Requirement: Demo creation guards against incomplete implementation
The demo skill SHALL verify all tasks are complete before constructing the demo.

#### Scenario: All tasks checked
- **WHEN** tasks.md has all items checked (`- [x]`)
- **THEN** demo construction proceeds

#### Scenario: Unchecked tasks exist
- **WHEN** tasks.md has unchecked items (`- [ ]`)
- **THEN** the skill lists the incomplete tasks
- **THEN** the skill directs the agent to run `/opsx:apply` first
- **THEN** demo construction does not proceed

### Requirement: Demo includes Entire attribution data
The demo artifact SHALL reference Entire attribution data in its assessment section.

#### Scenario: Attribution in assessment
- **WHEN** the demo is being finalized
- **THEN** `showboat exec <change-dir>/demo.md bash 'git log --format="%(trailers:key=Entire-Attribution)" -5'` captures recent attribution data
- **THEN** the agent adds a `showboat note` summarizing agent vs human contribution percentages

### Requirement: Rodney accessibility tree support
The demo skill SHALL support using Rodney's accessibility commands for non-visual verification of web content.

#### Scenario: Accessibility tree verification
- **WHEN** an agent verifies web content structure
- **THEN** `showboat exec <change-dir>/demo.md bash 'rodney ax-tree --depth 3'` captures the accessibility tree
- **THEN** the captured tree serves as structural evidence alongside visual screenshots

### Requirement: Showboat extract for reproducibility
The demo artifact SHALL support extraction of all commands for manual re-execution.

#### Scenario: Extract commands
- **WHEN** a human or agent runs `showboat extract <change-dir>/demo.md`
- **THEN** a sequence of showboat CLI commands is emitted that recreates the entire demo document
