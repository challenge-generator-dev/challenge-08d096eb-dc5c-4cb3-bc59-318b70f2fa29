terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
}

resource "aws_dynamodb_table" "orders" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.partition_key_name
  range_key      = var.sort_key_name
  table_class    = var.table_class

  attribute {
    name = var.partition_key_name
    type = "S"
  }

  dynamic "attribute" {
    for_each = var.sort_key_name != "" ? [1] : []
    content {
      name = var.sort_key_name
      type = "S"
    }
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "customerId"
    type = "S"
  }

  global_secondary_index {
    name            = "status-createdAt-index"
    hash_key        = "status"
    range_key       = "createdAt"
    projection_type = "ALL"
    read_capacity   = var.gsi_read_capacity
    write_capacity  = var.gsi_write_capacity
  }

  global_secondary_index {
    name            = "customerId-index"
    hash_key        = "customerId"
    projection_type = "ALL"
    read_capacity   = var.gsi_read_capacity
    write_capacity  = var.gsi_write_capacity
  }

  ttl {
    attribute_name = "ttl"
    enabled        = var.ttl_enabled
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery_enabled
  }

  server_side_encryption {
    enabled     = var.server_side_encryption_enabled
    kms_key_arn = var.kms_key_arn
  }

  tags = merge(
    var.tags,
    {
      "Name"        = var.table_name
      "Environment" = var.environment
      "Component"   = "orders"
    }
  )

  lifecycle {
    prevent_destroy = var.prevent_destroy
    ignore_changes = [tags]
  }
}

resource "aws_iam_policy" "dynamodb_read_policy" {
  name        = "${var.table_name}-read-policy"
  description = "Política de lectura para la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowReadAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:DescribeTable"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_policy" "dynamodb_write_policy" {
  name        = "${var.table_name}-write-policy"
  description = "Política de escritura para la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowWriteAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:DescribeTable"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      },
      {
        Sid    = "AllowTTLManagement"
        Effect = "Allow"
        Action = [
          "dynamodb:UpdateTimeToLive",
          "dynamodb:DescribeTimeToLive"
        ]
        Resource = aws_dynamodb_table.orders.arn
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_policy" "dynamodb_full_access_policy" {
  name        = "${var.table_name}-full-access-policy"
  description = "Política de acceso completo para la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowFullAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:*"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      }
    ]
  })

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "dynamodb_logs" {
  name              = "/aws/dynamodb/${var.table_name}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.cloudwatch_kms_key_arn
  tags              = var.tags
}

resource "aws_dynamodb_table" "orders_backup" {
  count = var.enable_backup_table ? 1 : 0

  name           = "${var.table_name}-backup"
  billing_mode   = var.billing_mode
  hash_key       = var.partition_key_name
  range_key      = var.sort_key_name
  table_class    = var.table_class

  attribute {
    name = var.partition_key_name
    type = "S"
  }

  attribute {
    name = var.sort_key_name
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = var.kms_key_arn
  }

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-backup"
      "Environment" = var.environment
      "Component"   = "orders-backup"
      "Backup"      = "true"
    }
  )
}