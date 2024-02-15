locals {
  lambda_policy_vars = {
    for lambda_name, value in var.lambda_functions : format("%s_lambda_invoke_arn", lambda_name) => value.invoke_arn
    if var.lambda_functions[lambda_name].allow_api_gateway_execution == true
  }
}
