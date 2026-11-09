output "dynamodb_table_name" {
  description = "Nombre de la tabla de órdenes en DynamoDB"
  value       = module.dynamodb.table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de órdenes en DynamoDB"
  value       = module.dynamodb.table_arn
}

output "dynamodb_table_id" {
  description = "ID único de la tabla de órdenes en DynamoDB"
  value       = module.dynamodb.table_id
}

output "dynamodb_endpoint" {
  description = "Endpoint de la tabla de órdenes en DynamoDB"
  value       = "https://dynamodb.${var.region}.amazonaws.com"
}

output "dynamodb_region" {
  description = "Región donde está desplegada la tabla de órdenes"
  value       = var.region
}

output "environment" {
  description = "Entorno de despliegue"
  value       = var.environment
}

output "table_status" {
  description = "Estado actual de la tabla de DynamoDB"
  value       = module.dynamodb.table_item_count
}