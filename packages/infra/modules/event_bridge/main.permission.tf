resource "aws_lambda_permission" "allow_events_bridge_to_run_lambda" {
  for_each = local.scheduler_configuration

  statement_id  = format("AllowStartRDSExecutionFromEventBridge%s%s", each.key, var.random_name)
  action        = "lambda:InvokeFunction"
  function_name = each.value.lambda.function_name
  principal     = "events.amazonaws.com"
}
