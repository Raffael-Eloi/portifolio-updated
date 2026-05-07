## DevOps Review — 2026-05-06

### Summary

The Terraform configuration is currently a minimal stub containing a single resource — `azurerm_resource_group.raffa_lab` — with no backend configuration, no tags, no additional resources, and no observability or security controls. Because the codebase is at a very early stage, most checklist items are gaps by omission rather than active misconfigurations. The highest-risk finding is the absence of a remote state backend, which means state is stored locally and cannot be safely shared across a team or CI/CD pipeline. Quick wins include: adding a remote backend (e.g. Azure Blob), tagging the resource group, pinning a `terraform` version block alongside the provider pin, and adding a resource lock on the resource group.

---

### Findings

| # | Severity | Category | Resource | Finding | Recommendation |
|---|----------|----------|----------|---------|----------------|
| 1 | Critical | Terraform Best Practices | `terraform {}` block | No remote state backend is configured. State is stored locally, making team collaboration and CI/CD impossible and risking state loss or corruption. | Add an `azurerm` backend block pointing to an Azure Blob Storage container with state locking enabled via a storage account. |
| 2 | High | Security | `azurerm_resource_group.raffa_lab` | No `azurerm_management_lock` (resource lock) is applied to the resource group. An accidental `terraform destroy` or manual deletion in the portal would wipe all contained resources. | Add `azurerm_management_lock` with `lock_level = "CanNotDelete"` for production resource groups. |
| 3 | High | Cost | `azurerm_resource_group.raffa_lab` | No cost-allocation tags (`environment`, `owner`, `project`) are defined on the resource group. All child resources inherit the group's tags in Azure, so missing tags here means no cost attribution for anything deployed later. | Add a `tags` block with at minimum `environment`, `owner`, and `project` keys. Drive tag values from input variables. |
| 4 | High | Terraform Best Practices | `terraform {}` block | No `required_version` constraint is specified for Terraform itself. Any Terraform CLI version could be used, risking behaviour differences between local runs and CI. | Add `required_version = "~> 1.9"` (or the version in use) inside the `terraform {}` block. |
| 5 | Medium | Terraform Best Practices | `provider "azurerm"` | `resource_provider_registrations = "none"` suppresses automatic provider registration. This is acceptable in locked-down environments but must be intentional and documented; without it the provider will silently fail to create resources if a required RP is not registered. | Add a comment explaining why registration is disabled, or remove the setting and let Terraform manage registrations normally. |
| 6 | Medium | Terraform Best Practices | `infrastructure/terraform.tf` | The location `"East US 2"` is hardcoded as a string literal. Any future resources that reference this value must duplicate the string, making region changes error-prone. | Extract location into an input variable: `variable "location" { type = string; default = "East US 2"; description = "Azure region for all resources." }` and reference it as `var.location`. |
| 7 | Medium | Azure-Specific Compliance | `azurerm_resource_group.raffa_lab` | The resource group name `RaffaLabRG` follows a recognisable convention but does not encode environment (dev/staging/prod). As the project grows, multiple environments will collide or require manual renaming. | Adopt a parameterised naming pattern such as `"RaffaLab${var.environment}RG"` driven by an `environment` variable. |
| 8 | Medium | Observability | (none) | No Log Analytics workspace, `azurerm_monitor_diagnostic_setting`, or alerting rules exist. As soon as real resources are added they will produce no observable telemetry. | Plan and add a `azurerm_log_analytics_workspace` resource early; attach diagnostic settings to every resource that supports it. |
| 9 | Low | Terraform Best Practices | All `.tf` files | There is only one `.tf` file for all configuration (provider, backend, resources). As the project grows this will become difficult to maintain. | Separate into conventional files: `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`, and optionally `backend.tf`. |
| 10 | Low | Terraform Best Practices | (none) | No `outputs.tf` is defined. Important values (resource group name, location, resource IDs) are not surfaced for consumption by other modules or CI pipelines. | Add an `outputs.tf` with at minimum the resource group name and location; mark sensitive outputs with `sensitive = true`. |

---

### Positive Observations

- The `azurerm` provider version is pinned to an exact version (`= 4.1.0`) rather than a floating range, which is the correct practice for production and prevents unexpected provider upgrades.
- A `.terraform.lock.hcl` file is committed to source control, ensuring that all collaborators and CI runners use identical provider binaries with verified checksums.
- The provider block is clean and minimal with no unnecessary configuration.
- The CI/CD pipeline (`ci-cd-pipeline.yml`) exists and covers build and unit test stages, providing a foundation to add `terraform fmt`, `terraform validate`, and `terraform plan` checks in future.

---

### Next Steps

1. **Configure a remote backend (Critical)** — Create an Azure Storage Account and Blob container, then add a `backend "azurerm" {}` block in `versions.tf`. Run `terraform init -migrate-state` to move local state to the remote backend.
2. **Add resource lock (High)** — Add `azurerm_management_lock` on `azurerm_resource_group.raffa_lab` immediately; this takes seconds and prevents accidental destruction.
3. **Add cost tags (High)** — Define `environment`, `owner`, and `project` variables and attach them as a `tags` block on the resource group.
4. **Pin Terraform version (High)** — Add `required_version` to the `terraform {}` block and enforce it in the CI pipeline with `terraform version` validation.
5. **Parameterise location (Medium)** — Replace the hardcoded `"East US 2"` string with a variable to enable reuse across environments and regions.
6. **Split configuration files (Low)** — Refactor `terraform.tf` into `main.tf`, `variables.tf`, `outputs.tf`, and `versions.tf` before the codebase grows further.
7. **Plan observability layer (Medium)** — Add a Log Analytics workspace and establish a pattern of attaching diagnostic settings to every future resource from the start.
8. **Integrate Terraform into CI pipeline (Medium)** — Add `terraform fmt -check`, `terraform validate`, and a gated `terraform plan` step to `ci-cd-pipeline.yml` so infrastructure changes are reviewed before merge.
