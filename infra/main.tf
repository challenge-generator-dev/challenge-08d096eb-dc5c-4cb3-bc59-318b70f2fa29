# Definición de recursos de infraestructura para DynamoDB
# Este archivo contiene la configuración de la tabla de órdenes
# que será utilizada por la aplicación para persistir datos

resource "aws_dynamodb_table" "orders" {
  name           = var.table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "orderId"
  range_key      = "customerId"

  attribute {
    name = "orderId"
    type = "S"
  }

  attribute {
    name = "customerId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name            = "status-created-index"
    hash_key        = "status"
    range_key       = "createdAt"
    projection_type = "ALL"
    read_capacity   = 5
    write_capacity  = 5
  }

  local_secondary_index {
    name            = "customer-orders-index"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  tags = {
    Environment = var.environment
    Project     = "orders-api"
    ManagedBy   = "terraform"
  }

  point_in_time_recovery {
    enabled = var.enable_pit_recovery
  }

  ttl {
    attribute_name = "expirationTime"
    enabled        = var.enable_ttl
  }
}

resource "aws_iam_role" "dynamodb_access" {
  name = "${var.environment}-dynamodb-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = var.common_tags
}

resource "aws_iam_policy" "dynamodb_read_write" {
  name        = "${var.environment}-dynamodb-read-write-policy"
  description = "Política de lectura y escritura para la tabla de órdenes"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:GetItem",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.orders.arn
      }
    ]
  })

  tags = var.common_tags
}

resource "aws_iam_role_policy_attachment" "dynamodb_access_attach" {
  role       = aws_iam_role.dynamodb_access.name
  policy_arn = aws_iam_policy.dynamodb_read_write.arn
}

resource "aws_ssm_parameter" "dynamodb_table_name" {
  name  = "/${var.environment}/dynamodb/table-name"
  type  = "String"
  value = aws_dynamodb_table.orders.name

  tags = var.common_tags
}

resource "aws_ssm_parameter" "dynamodb_endpoint" {
  name  = "/${var.environment}/dynamodb/endpoint"
  type  = "String"
  value = "https://dynamodb.${var.region}.amazonaws.com"

  tags = var.common_tags
}

resource "aws_kms_key" "dynamodb_encryption" {
  description             = "Clave KMS para cifrado de la tabla de órdenes"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = merge(
    var.common_tags,
    {
      Name = "${var.environment}-dynamodb-kms-key"
    }
  )
}

resource "aws_kms_alias" "dynamodb_encryption_alias" {
  name          = "alias/${var.environment}-orders-key"
  target_key_id = aws_kms_key.dynamodb_encryption.key_id
}

resource "aws_cloudwatch_log_group" "dynamodb_audit" {
  name              = "/aws/dynamodb/${var.environment}/orders-audit"
  retention_in_days = var.log_retention_days
  kms_key_id        = aws_kms_key.dynamodb_encryption.arn

  tags = var.common_tags
}