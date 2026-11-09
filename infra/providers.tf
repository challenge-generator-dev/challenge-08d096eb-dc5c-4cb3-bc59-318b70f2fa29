# Configuración de providers para Terraform
# Este archivo define los providers necesarios para interactuar con AWS
# y asegura que se utilicen las versiones especificadas para evitar breaking changes.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
  required_version = ">= 1.0.0"
}

# Configuración del provider AWS
# Se utilizan variables para permitir la configuración dinámica según el entorno.
provider "aws" {
  region = var.aws_region
  # Las credenciales se configuran mediante AWS CLI o variables de entorno
  # para evitar hardcodear valores sensibles.
}

# Variables globales para la configuración del provider
# Estas variables se definen en variables.tf y se utilizan aquí para parametrizar
# la configuración del provider.
variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}