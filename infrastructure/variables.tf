variable "project" {
  type        = string
  default     = "portfolio"
  description = "Name of the Azure Static Web App resource."
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment: dev, staging, or production."

  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "environment must be one of: dev, staging, production."
  }
}
