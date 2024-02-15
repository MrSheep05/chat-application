resource "aws_lambda_permission" "api_gateway_lambda_permissions" {
  for_each = {
    for key, value in var.lambda_functions : key => value
    if key != "authorize" && value.route_key != ""
  }

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"

  # The /*/*/* part allows invocation from any stage, method and resource path
  source_arn = format("%s/*/*", aws_apigatewayv2_api.chat_websocket_api.execution_arn)
}

resource "aws_lambda_permission" "api_gateway_lambda_permissions_authorize" {
  statement_id  = "AllowExecutionFromAPIGateway-authorize"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_functions["authorize"].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = format("%s/**", aws_apigatewayv2_api.chat_websocket_api.execution_arn)
}
