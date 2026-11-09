# Definición de variables de entrada para Terraform
# Estas variables permiten parametrizar la configuración de la infraestructura
# y adaptarla a diferentes entornos (dev, staging, prod).

# Variables globales
variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

# Variables para DynamoDB
variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para las órdenes"
  type        = string
  default     = "orders-table"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
  default     = "order_id"
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    },
    {
      name = "created_at"
      type = "S"
    },
    {
      name = "updated_at"
      type = "S"
    }
  ]
}

# Variables para entornos
variable "environment" {
  description = "Entorno donde se desplegará la infraestructura (dev, staging, prod)"
  type        = string
  default     = "dev"
}