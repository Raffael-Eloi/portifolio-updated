resource "azurerm_resource_group" "main" {
  name     = "rg-${var.application_name}-${var.environment_name}"
  location = var.region
  tags     = local.tags
}

resource "azurerm_static_web_app" "web_app" {
  location            = azurerm_resource_group.main.location
  name                = var.application_name
  resource_group_name = azurerm_resource_group.main.name
  sku_size            = "Free"
  sku_tier            = "Free"
  tags                = local.tags
}