resource "aws_apigatewayv2_route" "routes" {
  for_each = {
    for key, value in var.lambda_functions : key => value
    if value.route_key != "" && key != "connect"
  }

  api_id             = aws_apigatewayv2_api.chat_websocket_api.id
  route_key          = each.value.route_key
  authorization_type = "NONE"

  target = format("integrations/%s", aws_apigatewayv2_integration.lambda_integrations[each.key].id)
}

resource "aws_apigatewayv2_route" "attach_auth" {
  api_id             = aws_apigatewayv2_api.chat_websocket_api.id
  route_key          = var.lambda_functions["connect"].route_key
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt_autho.id

  target = format("integrations/%s", aws_apigatewayv2_integration.lambda_integrations["connect"].id)
}
