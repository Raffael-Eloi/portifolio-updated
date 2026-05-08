## DevOps Review — 2026-05-08

### Summary

Seven of the ten findings from the 2026-05-07 review have been resolved in this cycle: blob versioning is enabled, a resource lock is applied to the storage account, the unused `var.location` in the main module is gone, the `var.project` default is now lowercase, and both prior medium-security findings (4 and 5) are fully addressed. Three medium/low issues carry forward: the bogus Terraform version (`1.15.2`) in CI, missing observability resources, and the `required_version` lower-bound constraint. A new finding is noted: the `resource_provider_registrations = "none"` in `infrastructure/main.tf` still has no explanatory comment (the bootstrap file received the comment last cycle; the main file did not), and the bootstrap pipeline (`bootstrap.yml`) repeats the same invalid Terraform version, expanding finding 1's blast radius. The highest-risk active issue remains the non-existent Terraform version in CI, which will prevent every pipeline run from completing.

---

### Findings

| # | Severity | Category | Resource | Finding | Recommendation |
|---|----------|----------|----------|---------|----------------|
| 1 | High | CI/CD | `.github/workflows/ci-cd-pipeline.yml` and `.github/workflows/bootstrap.yml` | `terraform_version: "1.15.2"` is set in both `terraform_plan` and `terraform_apply` jobs across both pipelines. Terraform 1.15.2 does not exist — the latest 1.x release is 1.9.x. `hashicorp/setup-terraform` will fail or resolve an unexpected version on every run. | Change to a real release such as `"1.9.8"` in all four job steps. Optionally pin the version to a single workflow-level env variable to keep it in one place. |
| 2 | Medium | Security | `provider "azurerm"` in `infrastructure/main.tf` (line 29) | `resource_provider_registrations = "none"` has no inline comment. The bootstrap module received this comment in the previous cycle but `infrastructure/main.tf` did not. Without context, future maintainers may remove the setting, causing silent provider-registration failures due to insufficient RBAC. | Add `# Resource provider registration is managed outside Terraform to limit required RBAC permissions.` above the provider block, matching the comment already present in `infrastructure/bootstrap/required_main.tf`. |
| 3 | Medium | Observability | All resources | No `azurerm_monitor_diagnostic_setting`, Log Analytics workspace, or alerting rules are defined. Both `azurerm_static_web_app` and `azurerm_storage_account` support diagnostic settings. | Add an `azurerm_log_analytics_workspace` (Free or PerGB2018 SKU) and attach `azurerm_monitor_diagnostic_setting` to the storage account and static web app. |
| 4 | Low | Terraform Best Practices | `infrastructure/main.tf` and `infrastructure/bootstrap/required_main.tf` | `required_version = ">= 1.5.2"` uses an open-ended lower bound. Any future Terraform 2.x release would satisfy this constraint and could introduce breaking changes silently. | Change to `~> 1.5` (pessimistic constraint operator) to allow patch/minor upgrades within 1.x but block 2.x. |
| 5 | Low | CI/CD | `.github/workflows/ci-cd-pipeline.yml` | The `push` trigger is still commented out (lines 5–6). Infrastructure changes merged to `main` are not automatically validated or applied; every run requires a manual `workflow_dispatch`. | Uncomment `push: branches: ["main"]` (or add a `pull_request` trigger for plan-only validation) so CI enforces correctness on every merge. |
| 6 | Low | Terraform Best Practices | `infrastructure/bootstrap/` | No `outputs.tf` exists in the bootstrap module. The storage account name (`raffalabstorageaccount`), container name (`raffalab-tfstate`), and resource group name (`RaffaLabRG`) are hardcoded strings duplicated verbatim in the `backend "azurerm"` block of `infrastructure/main.tf`. Drift between these values would cause `terraform init` to fail silently. | Add an `outputs.tf` to the bootstrap module that surfaces `storage_account_name`, `container_name`, and `resource_group_name` as the authoritative source. Reference or document those values when configuring the backend in `main.tf`. |

---

### Resolved Since Last Review

The following findings from the 2026-05-07 report have been fully addressed:

- **Finding 2 (Medium)** — Unused `var.location` removed from `infrastructure/variables.tf`.
- **Finding 3 (Medium, partially)** — `resource_provider_registrations = "none"` comment added to `infrastructure/bootstrap/required_main.tf`.
- **Finding 4 (Medium)** — Blob versioning (`versioning_enabled = true`) enabled on the state storage account.
- **Finding 5 (Medium)** — `azurerm_management_lock` added to the storage account in the bootstrap module.
- **Finding 8 (Low)** — `var.project` default changed to lowercase `"portfolio"`.

---

### Positive Observations

- The bootstrap module is a clean, well-structured pattern: resource group, storage account (with TLS enforcement, HTTPS-only, private container, soft-delete, versioning), and management locks — all with consistent cost-allocation tags.
- Management locks (`CanNotDelete`) are applied to both the resource group and the storage account, protecting state infrastructure from accidental deletion.
- The `web_app_api_key` output is marked `sensitive = true` and masked in the CI deploy step with `echo "::add-mask::$API_KEY"` — a defence-in-depth practice for keeping secrets out of logs.
- Provider version is pinned exactly (`= 4.1.0`) and `.terraform.lock.hcl` files with SHA-256 hashes are committed in both modules, ensuring fully reproducible provider resolution.
- OIDC-based Azure login is used in both pipelines instead of long-lived service principal credentials — the current Azure/GitHub best practice.
- All variables have `type`, `description`, and sensible `default` values; the `environment` variable includes a `validation` block in both modules.
- Cost-allocation tags (`environment`, `owner`, `project`, `managed_by`) are applied consistently via a `locals` block in both modules.
- The static web app location is derived from `data.azurerm_resource_group.raffa_lab_rg.location`, ensuring it always co-locates with its resource group.
- The CI pipeline separates `terraform fmt -check`, `terraform validate`, `terraform plan` (with artifact upload), and `terraform apply` (behind a `production` environment gate) — textbook pipeline structure.

---

### Next Steps

1. **Fix the Terraform version in CI (High)** — Update `terraform_version` from `"1.15.2"` to `"1.9.8"` (or latest stable 1.x) in all four job steps across `ci-cd-pipeline.yml` and `bootstrap.yml`. Consider extracting it to a single `env:` block at the workflow level.
2. **Add resource_provider_registrations comment to main.tf (Medium)** — Add the explanatory comment to `infrastructure/main.tf` to match `bootstrap/required_main.tf` and prevent future maintainers from inadvertently removing the setting.
3. **Add observability resources (Medium)** — Create an `azurerm_log_analytics_workspace` and attach `azurerm_monitor_diagnostic_setting` to the storage account and static web app.
4. **Tighten required_version constraint (Low)** — Change `>= 1.5.2` to `~> 1.5` in both `main.tf` and `bootstrap/required_main.tf` to prevent accidental major-version upgrades.
5. **Re-enable the CI push trigger (Low)** — Uncomment `push: branches: ["main"]` in `ci-cd-pipeline.yml` so infrastructure changes are automatically validated on every merge.
6. **Add outputs to the bootstrap module (Low)** — Create `infrastructure/bootstrap/outputs.tf` surfacing `storage_account_name`, `container_name`, and `resource_group_name` to document the authoritative source for backend configuration values.
