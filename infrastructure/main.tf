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

resource "azurerm_dns_cname_record" "www" {
  name                = "www.raffaeleloi.dev"
  zone_name           = "www.raffaeleloi.dev"
  resource_group_name = azurerm_resource_group.main.name
  ttl                 = 300
  record              = azurerm_static_web_app.web_app.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "www" {
  static_web_app_id = azurerm_static_web_app.web_app.id
  domain_name       = "${azurerm_dns_cname_record.www.name}.${azurerm_dns_cname_record.www.zone_name}"
  validation_type   = "cname-delegation"
}

resource "azurerm_dns_cname_record" "apex" {
  name                = "raffaeleloi.dev"
  zone_name           = "raffaeleloi.dev"
  resource_group_name = azurerm_resource_group.main.name
  ttl                 = 300
  record              = azurerm_static_web_app.web_app.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "apex" {
  static_web_app_id = azurerm_static_web_app.web_app.id
  domain_name       = "${azurerm_dns_cname_record.apex.name}.${azurerm_dns_cname_record.apex.zone_name}"
  validation_type   = "cname-delegation"
}