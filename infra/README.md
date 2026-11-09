# Módulo de Infraestructura DynamoDB

Este módulo define la infraestructura necesaria para persistir órdenes en DynamoDB.

## Recursos Definidos

- **Tabla DynamoDB**: Almacena las órdenes del sistema con los siguientes atributos:
  - `orderId` (PK): Identificador único de la orden
  - `status`: Estado de la orden (PENDING, COMPLETED, CANCELLED)
  - `createdAt`: Fecha de creación de la orden
  - `updatedAt`: Fecha de última modificación
  - `customerId`: Identificador del cliente
  - `totalAmount`: Monto total de la orden

## Estructura del Módulo

```
infra/
├── versions.tf       # Configuración de versiones de Terraform y providers
├── main.tf           # Definición de recursos principales
├── variables.tf      # Variables de entrada del módulo
├── outputs.tf        # Salidas del módulo para consumo externo
└── README.md         # Este archivo
```

## Uso del Módulo

Para utilizar este módulo desde la raíz del proyecto:

```hcl
module "dynamodb" {
  source = "./infra"

  environment = "dev"
  table_name  = "orders"
}
```

## Validación Local

Para validar la configuración de Terraform:

```bash
# Inicializar Terraform
terraform init

# Validar sintaxis y configuración
terraform validate

# Planificar cambios (ver qué recursos se crearán)
terraform plan
```

## Requisitos

- Terraform >= 1.0
- Proveedor AWS hashicorp/aws 5.50.0
- Credenciales de AWS configuradas (variables de entorno, profile o IAM role)

## Notas

- La tabla usa PAY_PER_REQUEST para el modo de facturación
- El encryption está habilitado por defecto con AWS owned key
- La eliminación automática está deshabilitada para proteger datos
- El throughput inicial es 5 reads y 5 writes (mínimo para tablas underlay)