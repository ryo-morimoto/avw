Construct the demo artifact for a verified change using Showboat + Rodney.

**Prerequisites**: All tasks in tasks.md must be checked (`- [x]`). If any are unchecked, list incomplete tasks and direct the user to run `/opsx:apply` first.

**Steps**

1. **Validate task completion**

   Read `tasks.md` from the change directory. Parse all `- [ ]` and `- [x]` entries. If ANY are unchecked:
   - List the incomplete tasks
   - Say: "Complete all tasks before creating the demo. Run `/opsx:apply <change-name>`."
   - STOP

2. **Check tools**

   ```bash
   showboat --version
   rodney --version
   ```

   Both must be available. Stop if either is missing.

3. **Initialize demo**

   ```bash
   showboat init <change-dir>/demo.md "<change-name> Verification"
   ```

4. **Construct verification steps**

   For each key feature or requirement from the specs:

   a. Add a context note explaining what's being verified:
      ```bash
      showboat note <change-dir>/demo.md "Verifying: <feature description>"
      ```

   b. For CLI/API features — run the verification command:
      ```bash
      showboat exec <change-dir>/demo.md bash '<verification-command>'
      ```

   c. For browser/UI features — use Rodney:
      ```bash
      rodney start
      rodney open <url>
      showboat image <change-dir>/demo.md 'rodney screenshot /tmp/<name>.png && echo /tmp/<name>.png'
      ```
      For structural verification:
      ```bash
      showboat exec <change-dir>/demo.md bash 'rodney ax-tree --depth 3'
      ```
      After all browser steps:
      ```bash
      rodney stop
      ```

5. **Capture Entire attribution**

   ```bash
   showboat exec <change-dir>/demo.md bash 'git log --format="%(trailers:key=Entire-Attribution)" -5'
   ```

   Add a summary note with agent vs human contribution percentages:
   ```bash
   showboat note <change-dir>/demo.md "Attribution: <agent>% agent, <human>% human"
   ```

6. **Verify reproducibility**

   ```bash
   showboat verify <change-dir>/demo.md
   ```

   Exit code 0 confirms all blocks reproduce. If verification fails, investigate and fix the failing blocks.
