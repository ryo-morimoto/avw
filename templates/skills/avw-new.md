Start a new AVW change with prerequisite validation.

**Steps**

1. **Check prerequisites**

   Validate that all required tools are installed and available:

   ```bash
   entire --version   # Require entireio/cli
   showboat --version # Require simonw/showboat >= 0.4.0
   rodney --version   # Require simonw/rodney >= 0.3.0
   ```

   If any tool is missing, list what's needed and stop. Do not proceed without all dependencies.

2. **Check for existing solutions**

   If the user has described target capabilities, search `openspec/solutions/<capability>/` for each one. List relevant prior art to inform the proposal.

3. **Create the change**

   ```bash
   {{openspec_cmd}} new change "<name>" --schema avw
   ```

   Use the name provided by the user. If no name was given, ask for one.

4. **Show status**

   ```bash
   {{openspec_cmd}} status --change "<name>"
   ```

   Display the 6-artifact DAG and explain the next step: create the proposal with `/opsx:continue <name>`.
