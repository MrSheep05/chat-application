resource "aws_cloudwatch_log_group" "websocket_api" {
  name              = "/aws/apigateway/websocket-api"
  retention_in_days = 14
}

resource "aws_apigatewayv2_stage" "production" {
  api_id = aws_apigatewayv2_api.chat_websocket_api.id
  name   = "production"

  default_route_settings {
    logging_level            = "INFO"
    detailed_metrics_enabled = true
    throttling_burst_limit   = 1000
    throttling_rate_limit    = 5000
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.websocket_api.arn
    format = jsonencode({
      requestId             = "$context.requestId"
      ip                    = "$context.identity.sourceIp"
      caller                = "$context.identity.caller"
      user                  = "$context.identity.user"
      requestTime           = "$context.requestTime"
      eventType             = "$context.eventType"
      routeKey              = "$context.routeKey"
      status                = "$context.status"
      connectionId          = "$context.connectionId"
      errorMessage          = "$context.integrationErrorMessage"
      authorizer            = "$context.authorizer.error"
      authorizerIntegration = "$context.authorizer.integrationStatus"
    })
  }

  route_settings {
    route_key                = var.lambda_functions["connect"].route_key
    logging_level            = "INFO"
    detailed_metrics_enabled = true
    throttling_burst_limit   = 1000
    throttling_rate_limit    = 5000
  }
}