output "table_name" {
  description = "Nombre de la tabla de órdenes en DynamoDB"
  value       = aws_dynamodb_table.orders.name
}

output "table_arn" {
  description = "ARN completo de la tabla de órdenes"
  value       = aws_dynamodb_table.orders.arn
}

output "table_id" {
  description = "Identificador único de la tabla de órdenes"
  value       = aws_dynamodb_table.orders.id
}

output "table_status" {
  description = "Estado actual de la tabla (ACTIVE, CREATING, DELETING, UPDATING)"
  value       = aws_dynamodb_table.orders.status
}

output "table_size_bytes" {
  description = "Tamaño actual de la tabla en bytes"
  value       = aws_dynamodb_table.orders.table_size_bytes
}

output "item_count" {
  description = "Cantidad de elementos actualmente almacenados en la tabla"
  value       = aws_dynamodb_table.orders.item_count
}

output "partition_key_name" {
  description = "Nombre de la clave de partición"
  value       = var.partition_key_name
}

output "partition_key_type" {
  description = "Tipo de la clave de partición"
  value       = "S"
}

output "sort_key_name" {
  description = "Nombre de la clave de ordenación"
  value       = var.sort_key_name
}

output "sort_key_type" {
  description = "Tipo de la clave de ordenación"
  value       = "S"
}

output "gsi_status_createdAt_index_name" {
  description = "Nombre del índice global secundario para status y createdAt"
  value       = "status-createdAt-index"
}

output "gsi_customerId_index_name" {
  description = "Nombre del índice global secundario para customerId"
  value       = "customerId-index"
}

output "read_policy_arn" {
  description = "ARN de la política IAM de lectura para la tabla"
  value       = aws_iam_policy.dynamodb_read_policy.arn
}

output "write_policy_arn" {
  description = "ARN de la política IAM de escritura para la tabla"
  value       = aws_iam_policy.dynamodb_write_policy.arn
}

output "full_access_policy_arn" {
  description = "ARN de la política IAM de acceso completo para la tabla"
  value       = aws_iam_policy.dynamodb_full_access_policy.arn
}

output "log_group_name" {
  description = "Nombre del grupo de logs de CloudWatch para la tabla"
  value       = aws_cloudwatch_log_group.dynamodb_logs.name
}

output "backup_table_name" {
  description = "Nombre de la tabla de backup si está habilitada"
  value       = var.enable_backup_table ? aws_dynamodb_table.orders_backup[0].name : null
}

output "backup_table_arn" {
  description = "ARN de la tabla de backup si está habilitada"
  value       = var.enable_backup_table ? aws_dynamodb_table.orders_backup[0].arn : null
}

output "table_endpoint" {
  description = "Endpoint de la tabla de DynamoDB"
  value       = aws_dynamodb_table.orders.endpoint
}

output "billing_mode" {
  description = "Modo de facturación de la tabla (PROVISIONED o PAY_PER_REQUEST)"
  value       = aws_dynamodb_table.orders.billing_mode
}

output "table_class" {
  description = "Clase de almacenamiento de la tabla (STANDARD o STANDARD_INFREQUENT_ACCESS)"
  value       = aws_dynamodb_table.orders.table_class
}

output "stream_arn" {
  description = "ARN del stream de DynamoDB Streams si está habilitado"
  value       = aws_dynamodb_table.orders.stream_arn
}

output "replica_regions" {
  description = "Regiones configuradas para replicación de la tabla"
  value       = aws_dynamodb_table.orders.replica
}