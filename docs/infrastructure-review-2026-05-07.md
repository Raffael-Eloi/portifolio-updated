## DevOps Review — 2026-05-07

### Summary

The Terraform configuration has matured considerably since the previous review (2026-05-06): all ten findings from that report have been fully addressed — a remote backend is in place, resource locks are applied, cost tags are defined via a `locals` block, the `required_version` constraint is set, files are split across `main.tf` and `variables.tf`, the location is parameterised, and a bootstrap module creates the shared state infrastructure with its own lock file. The CI/CD pipeline now includes `terraform fmt`, `terraform validate`, and gated `terraform plan`/`apply` stages. The remaining gaps are narrower: no observability resources exist, the `resource_provider_registrations = "none"` setting is still uncommented, the pipeline references a non-existent Terraform version `1.15.2`, the `location` variable in `main.tf` is declared but never used (the resource group location is read from a data source), and the storage account hosting remote state lacks versioning and a resource lock of its own. Overall posture is good for a personal portfolio project; the highest-risk active finding is the Terraform version mismatch in CI which will cause every pipeline run to fail silently or with a confusing error.

---

### Findings

| # | Severity | Category | Resource | Finding | Recommendation |
|---|----------|----------|----------|---------|----------------|
| 1 | High | CI/CD | `.github/workflows/ci-cd-pipeline.yml` | `terraform_version: "1.15.2"` is set in both `terraform_plan` and `terraform_apply` jobs. Terraform 1.15.2 does not exist — the latest 1.x release at time of writing is 1.9.x. This will cause `hashicorp/setup-terraform` to fail or install an unexpected version. | Change the version to a real release, e.g. `"1.9.8"`, and align it with the `required_version = ">= 1.5.2"` constraint in `main.tf`. |
| 2 | Medium | Terraform Best Practices | `infrastructure/variables.tf` — `var.location` | `variable "location"` is declared in `main.tf`'s companion `variables.tf` with a default of `"eastus2"`, but it is never referenced anywhere in `main.tf`. The static web app's location is derived from the data source (`data.azurerm_resource_group.raffa_lab_rg.location`). The unused variable creates confusion and may cause `terraform validate` warnings in future tooling. | Remove `var.location` from `infrastructure/variables.tf`, or add a `lifecycle` / `validation`-only resource that enforces the location. If multi-region support is needed in future, wire it up then. |
| 3 | Medium | Security | `provider "azurerm"` (both `main.tf` and `bootstrap/required_main.tf`) | `resource_provider_registrations = "none"` disables automatic Azure resource provider registration. There is no inline comment explaining why. If a required provider (e.g. `Microsoft.Web` for Static Web Apps) is not pre-registered in the subscription, resource creation will fail with a cryptic error. | Add a comment: `# Resource provider registration is managed outside Terraform to limit required RBAC permissions.` If that is not the reason, remove the setting. |
| 4 | Medium | Security | `azurerm_storage_account.storage_account` (bootstrap) | Blob versioning is not enabled on the storage account holding Terraform state. Without versioning, an accidental overwrite or corrupt `terraform apply` irreversibly destroys the prior state file. | Add `blob_properties { versioning_enabled = true }` alongside the existing `delete_retention_policy` block. |
| 5 | Medium | Security | `azurerm_storage_account.storage_account` (bootstrap) | No `azurerm_management_lock` is applied to the storage account itself (only the resource group has a lock). Because the lock is `CanNotDelete` at the RG level, the storage account cannot be deleted — but its blobs (state files) can still be deleted manually. | Add a second `azurerm_management_lock` with `lock_level = "CanNotDelete"` scoped to `azurerm_storage_account.storage_account.id`. |
| 6 | Medium | Observability | All resources | No `azurerm_monitor_diagnostic_setting`, Log Analytics workspace, or alerting rules are defined. The `azurerm_static_web_app` and `azurerm_storage_account` both support diagnostic settings. | Add an `azurerm_log_analytics_workspace` resource (Free or PerGB2018 SKU is sufficient) and attach `azurerm_monitor_diagnostic_setting` to the storage account and static web app. |
| 7 | Low | Terraform Best Practices | `infrastructure/main.tf` | The `required_version = ">= 1.5.2"` constraint uses a minimum-only lower bound. Any future Terraform major version (2.x) could be used, potentially introducing breaking changes. | Tighten to `~> 1.5` (pessimistic constraint allowing patch/minor upgrades within 1.x) to avoid accidental major-version upgrades. |
| 8 | Low | Azure-Specific Compliance | `azurerm_static_web_app.web_app` | The static web app name is set to `var.project` which defaults to `"Portfolio"`. Azure Static Web App names must be globally unique and lowercase; an uppercase default may cause creation failures in some regions or with certain naming conventions. | Change the default to `"portfolio"` (lowercase) and consider appending a short unique suffix or environment name to ensure global uniqueness across environments. |
| 9 | Low | CI/CD | `.github/workflows/ci-cd-pipeline.yml` | The `push` trigger is commented out. The pipeline only runs on `workflow_dispatch`. Infrastructure changes merged to `main` are not automatically validated or applied. | Uncomment the `push: branches: ["main"]` trigger (or add a `pull_request` trigger for plan-only validation) so CI enforces correctness on every merge. |
| 10 | Low | Terraform Best Practices | `infrastructure/bootstrap/` | The bootstrap module has no `outputs.tf`. The storage account name, container name, and resource group name are hardcoded strings duplicated verbatim in `infrastructure/main.tf` backend block. Drift between these values would cause `terraform init` to fail silently. | Add outputs for `storage_account_name`, `container_name`, and `resource_group_name` to the bootstrap module so they can be referenced or at least documented as the authoritative source. |

---

### Positive Observations

- All ten findings from the 2026-05-06 review have been fully resolved. This is a significant improvement in one cycle.
- A `bootstrap/` module cleanly separates state-backend infrastructure from application infrastructure — the correct pattern for bootstrapping remote state in Azure.
- `azurerm_management_lock` with `CanNotDelete` is applied to the resource group in the bootstrap module, protecting all contained resources from accidental deletion.
- The storage account enforces `min_tls_version = "TLS1_2"` and `https_traffic_only_enabled = true`, and the state container access type is `"private"` — solid security defaults.
- Blob soft-delete (`delete_retention_policy.days = 7`) is enabled, providing a recovery window for state file deletions.
- Cost-allocation tags (`environment`, `owner`, `project`, `managed_by`) are consistently applied via a `locals` block in both modules.
- All variables have `type`, `description`, and sensible `default` values; the `environment` variable includes a `validation` block constraining values to `dev`, `staging`, or `production`.
- The `web_app_api_key` output is marked `sensitive = true`, preventing the API key from appearing in plain-text CI logs.
- Provider version is pinned to an exact release (`= 4.1.0`) and a `.terraform.lock.hcl` with SHA-256 hashes is committed in both modules, ensuring reproducible provider resolution.
- The CI/CD pipeline now includes `terraform fmt -check -recursive`, `terraform validate`, a gated `terraform plan` with artifact upload, and a `terraform apply` stage protected by a GitHub `production` environment — all recommended patterns.
- Azure login in CI uses OIDC (`client-id`, `tenant-id`, `subscription-id` from secrets) rather than a long-lived service principal credential, which is the current best practice.

---

### Next Steps

1. **Fix the Terraform version in CI (High)** — Update `terraform_version` in both `terraform_plan` and `terraform_apply` jobs from `"1.15.2"` to a real version such as `"1.9.8"`. Verify it satisfies `required_version = ">= 1.5.2"`.
2. **Enable blob versioning on the state storage account (Medium)** — Add `versioning_enabled = true` inside the `blob_properties` block in `bootstrap/required_main.tf` to protect state files from accidental overwrite.
3. **Add a resource lock on the storage account (Medium)** — Add an `azurerm_management_lock` scoped to the storage account to prevent manual deletion of state blobs.
4. **Document or remove `resource_provider_registrations = "none"` (Medium)** — Add an inline comment explaining the intent, or remove the setting if it is not intentional.
5. **Remove the unused `var.location` from `infrastructure/variables.tf` (Medium)** — Clean up the dead variable to avoid confusion and keep the configuration self-consistent.
6. **Add observability resources (Medium)** — Create an `azurerm_log_analytics_workspace` and attach `azurerm_monitor_diagnostic_setting` to the storage account and static web app.
7. **Tighten `required_version` constraint (Low)** — Change `>= 1.5.2` to `~> 1.5` to prevent accidental major-version upgrades.
8. **Re-enable the CI push trigger (Low)** — Uncomment `push: branches: ["main"]` so infrastructure changes are automatically validated on every merge to main.
9. **Lowercase the `var.project` default (Low)** — Change `"Portfolio"` to `"portfolio"` to align with Azure naming requirements for Static Web Apps.
10. **Add outputs to the bootstrap module (Low)** — Surface `storage_account_name`, `container_name`, and `resource_group_name` as outputs so the main module's backend values have a documented authoritative source.
