resource "aws_apigatewayv2_authorizer" "jwt_autho" {
  name = "connection_authorizer"

  api_id          = aws_apigatewayv2_api.chat_websocket_api.id
  authorizer_type = "REQUEST"

  authorizer_uri   = var.lambda_functions["authorize"].invoke_arn
  identity_sources = ["route.request.querystring.token"]
}
