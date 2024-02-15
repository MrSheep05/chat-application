output "lambda_functions" {
  value = {
    for lambda_name, value in local.lambda_functions :
    lambda_name => {
      allow_api_gateway_execution = value.allow_api_gateway_execution,
      arn                         = aws_lambda_function.lambda_functions[lambda_name].arn,
      invoke_arn                  = aws_lambda_function.lambda_functions[lambda_name].invoke_arn,
      function_name               = aws_lambda_function.lambda_functions[lambda_name].function_name
      iam_role_name               = aws_iam_role.lambda_roles[lambda_name].name
      route_key                   = try(value.route_key, "")
      iam_role_arn                = aws_iam_role.lambda_roles[lambda_name].arn
      permissions                 = value.permissions
    }
  }
}
