Run a full infrastructure review by delegating to two agents in parallel:

1. Run `git diff` and `git diff --staged` to gather all current changes.
2. Delegate simultaneously to:
   - `devops-advisor` — for advisory guidance on the changes
   - `consistency-check` — for drift detection between Terraform and pipeline files
3. Wait for both agents to complete.
4. Synthesise the results into a single report:
   - Start with the consistency-check verdict (IN SYNC / DRIFT DETECTED)
   - Follow with the devops-advisor findings (What you did well / Suggestions / Summary)
   - End with a combined priority list of actions to take

If $ARGUMENTS is provided, pass it to `devops-advisor` as additional focus context.