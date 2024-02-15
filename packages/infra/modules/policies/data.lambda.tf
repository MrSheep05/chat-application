data "aws_iam_policy_document" "lambda_policies" {
  for_each = var.lambda_functions

  statement {
    sid = "RoleForBasicLambdaLogs"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    effect = "Allow"
    resources = [
      "*"
    ]
  }

  statement {
    sid = "RoleForVPCManagement"
    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface"
    ]
    effect = "Allow"
    resources = [
      "*"
    ]
  }

  dynamic "statement" {
    for_each = each.value.permissions.rds == "connect" ? [each.key] : []

    content {
      sid = "RoleForConnectingToDB"
      actions = [
        "rds-db:connect",
      ]
      effect = "Allow"
      resources = [
        format("arn:aws:rds-db:%s:%s:dbuser:*/*", data.aws_region.current.name, data.aws_caller_identity.current.account_id)
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.rds == "start" ? [each.key] : []

    content {
      sid = "RoleForStartingDB"
      actions = [
        "rds:StartDBInstance",
      ]
      effect = "Allow"
      resources = [
        format("arn:aws:rds:%s:%s:db:tprzytula", data.aws_region.current.name, data.aws_caller_identity.current.account_id)
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.rds == "stop" ? [each.key] : []

    content {
      sid = "RoleForStoppingDB"
      actions = [
        "rds:StopDBInstance",
      ]
      effect = "Allow"
      resources = [
        format("arn:aws:rds:%s:%s:db:tprzytula", data.aws_region.current.name, data.aws_caller_identity.current.account_id)
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.manage_connections == "true" ? [each.key] : []

    content {
      sid = "RoleForManagingConnections"
      actions = [
        "execute-api:ManageConnections",
      ]
      effect = "Allow"
      resources = [
        format("arn:aws:execute-api:%s:%s:%s/production/*", data.aws_region.current.name, data.aws_caller_identity.current.account_id, var.api_gateway_api_id)
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.kms == "sign" ? [each.key] : []

    content {
      sid = "RoleForSignKMS"
      actions = [
        "kms:Sign",
      ]
      effect = "Allow"
      resources = [
        var.kms_jwt_arn,
        var.kms_refresh_jwt_arn
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.kms == "verify" ? [each.key] : []

    content {
      sid = "RoleForVerifyKMS"
      actions = [
        "kms:Verify",
        "kms:GetPublicKey"
      ]
      effect = "Allow"
      resources = [
        var.kms_jwt_arn
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.kms == "sign-and-verify" ? [each.key] : []

    content {
      sid = "RoleForSignAndVerifyKMS"
      actions = [
        "kms:Sign",
        "kms:Verify",
        "kms:GetPublicKey"
      ]
      effect = "Allow"
      resources = [
        var.kms_refresh_jwt_arn,
        var.kms_jwt_arn
      ]
    }
  }
}
