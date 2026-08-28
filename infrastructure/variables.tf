variable "region" {
    type        = string
    description = "Azure region where resources are deployed (e.g. eastus2)."
}

variable "application_name" {
  type        = string
  description = "Name of the Azure Static Web App resource."
}

variable "environment_name" {
  type        = string
  description = "Deployment environment: dev, staging, or prod."

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment_name)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

variable "owner" {
    type        = string
    description = "Owner of the resources, used in the owner tag."
}

variable "managed_by" {
    type        = string
    description = "Tool or team managing the resources, used in the managed_by tag."
}

variable "cost_center" {
    type        = string
    description = "Cost center for billing attribution, used in the cost_center tag."
}