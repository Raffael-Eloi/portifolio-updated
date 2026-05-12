# improve-and-ship

Orchestrated quality improvement workflow: full code review → user approval → implement changes → pre-flight gate.

---

## Step 1 — Code Quality Review

Delegate to the `code-quality-advisor` agent with this prompt:

> "Perform a full read-only audit of the codebase. Return every finding using your standard template (Category, What is wrong, Why it matters, Options to improve it) and a Priority Matrix at the end."

Wait for the agent to complete. Collect every finding and the Priority Matrix.

---

## Step 2 — Present findings and get user approval

Show the user a numbered list of all findings. For each entry, include:
- **Number**, category, and title
- One-sentence summary of the problem
- The single recommended option (highest impact, lowest effort from the advisor's options)

Then ask:

> "Which of these findings would you like me to implement? Reply with the numbers (e.g. `1, 3, 5`) or `all`. I will implement them in priority order (High Impact first) and confirm each change with you before moving to the next."

**Do not proceed to Step 3 until the user replies.**

---

## Step 3 — Implement approved changes

Work through each approved finding in High → Medium → Low impact order.

For **each finding**, before touching any file:
1. State which files will change and describe the exact edit.
2. If the change involves a non-obvious trade-off or an architectural decision, explain it and ask for explicit confirmation before editing.
3. Apply the change using Edit or Write tools.
4. Confirm the change is complete, then move to the next finding.

Never batch-apply multiple findings without announcing each one first.

---

## Step 4 — Pre-flight check

After all approved changes are applied, delegate to the `pre-flight` agent:

> "Run all readiness checks — build, tests, Terraform formatting, and sensitive data scan. Return a go/no-go verdict."

---

## Step 5 — Resolve pre-flight failures (loop until green)

If pre-flight returns **no-go**:
1. Show the user exactly which check failed and the error output.
2. Read the relevant files to diagnose the root cause — do not guess.
3. Explain the proposed fix and ask for approval before touching any file.
4. Apply the fix once approved.
5. Return to Step 4.

Repeat until pre-flight returns **go**.

---

## Done

Report to the user that all approved improvements are in place and the app has passed pre-flight.
