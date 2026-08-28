output "web_app_api_key" {
  description = "Web application API key"
  value       = azurerm_static_web_app.web_app.api_key
  sensitive   = true
}