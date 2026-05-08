Delegate to the `pre-flight` agent.

The agent will run all readiness checks — build, tests, Terraform formatting, and sensitive data scan — and return a go/no-go verdict. No files will be modified.