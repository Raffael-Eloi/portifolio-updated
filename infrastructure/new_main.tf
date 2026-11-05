import {
  to = azurerm_static_web_app.web_app
  id = "/subscriptions/e3656b45-c85f-4814-93e2-4e0cdfd62696/resourceGroups/RaffaLabRG/providers/Microsoft.Web/staticSites/portfolio"
}

resource "azurerm_static_web_app" "web_app" {
  name                = "portfolio"
  resource_group_name = "RaffaLabRG"
  location            = "eastus2"
  sku_tier            = "Free"
  sku_size            = "Free"
  lifecycle {
    ignore_changes = [ "repository_branch", "repository_url", "tags" ]
  }
}
