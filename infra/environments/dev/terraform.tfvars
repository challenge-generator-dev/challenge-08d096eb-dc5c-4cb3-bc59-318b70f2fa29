region             = "us-east-1"
environment        = "dev"

# Configuración de la tabla de DynamoDB para órdenes
dynamodb_table_name = "orders-dev"

# Modo de facturación bajo demanda para desarrollo (ahorro de costos)
billing_mode        = "PAY_PER_REQUEST"

# Capacidad Provisionada (solo usado si billing_mode = PROVISIONED)
read_capacity  = 5
write_capacity = 5

# Habilitar eliminación de tabla al destruir (cuidado en producción)
delete_table_on_destroy = true

# Configuración de Point-in-Time Recovery
enable_point_in_time_recovery = true

# TTL para auto-limpieza de datos (en días)
ttl_days = 30

# Tags específicos del entorno
tags = {
  Environment = "dev"
  ManagedBy   = "terraform"
  Project     = "orders-api"
  CostCenter  = "engineering"
  DataClassification = "internal"
}

# Configuración de replicación (solo para producción)
enable_replication = false

# Configuración de streams para captura de cambios
enable_dynamodb_streams = true
stream_view_type = "NEW_AND_OLD_IMAGES"

# Límites de capacidad máxima (protección contra costos excesivos)
max_read_capacity  = 20
max_write_capacity = 20