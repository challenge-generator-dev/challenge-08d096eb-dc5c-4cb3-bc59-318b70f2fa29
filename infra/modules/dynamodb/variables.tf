# Variables específicas para el módulo DynamoDB
# Estas variables permiten configurar la tabla DynamoDB de manera flexible
# y reutilizable en diferentes entornos.

variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
}

variable "environment" {
  description = "Entorno donde se desplegará la tabla DynamoDB (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Tags para la tabla DynamoDB"
  type        = map(string)
  default = {
    Terraform   = "true"
    Environment = "dev"
  }
}