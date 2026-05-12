locals {
  tags = {
    environment = var.environment
    project     = "portfolio"
    owner       = "raffael-eloi"
    managed_by  = "terraform"
  }
}
terraform {
  required_version = ">= 1.5.2"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.1.0",
    }
  }

  backend "azurerm" {
    resource_group_name  = "RaffaLabRG"
    storage_account_name = "raffalabstorageaccount"
    container_name       = "raffalab-tfstate"
    key                  = "portfolio.tfstate"
  }

}

provider "azurerm" {
  resource_provider_registrations = "none"
  subscription_id                 = var.subscription_id
  features {}
}

data "azurerm_resource_group" "raffa_lab_rg" {
  name = "RaffaLabRG"
}

resource "azurerm_static_web_app" "web_app" {
  name                = var.project
  resource_group_name = data.azurerm_resource_group.raffa_lab_rg.name
  location            = data.azurerm_resource_group.raffa_lab_rg.location
  sku_tier            = "Free"
  sku_size            = "Free"
  tags                = local.tags
}

output "web_app_api_key" {
  description = "Web application API key"
  value       = azurerm_static_web_app.web_app.api_key
  sensitive   = true
}
