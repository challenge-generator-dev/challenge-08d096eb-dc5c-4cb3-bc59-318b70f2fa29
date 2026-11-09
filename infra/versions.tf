terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
}

# Configuración del proveedor de AWS para todas las regiones
# El proveedor se configura en el archivo providers.tf del raíz del proyecto
# Esta configuración define las restricciones de versión que Terraform aceptará
# Al usar version = "5.50.0" aseguramos compatibilidad con los recursos de DynamoDB
# que utilizaremos en este módulo. Los cambios menores dentro de la versión
# mayor no deben afectar la funcionalidad siempre que respetemos la API estable.
# La versión de Terraform >= 1.0 garantiza acceso a todas las features modernas
# incluyendo el formato de estado mejorado y las capacidades de validación.