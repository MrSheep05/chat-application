locals {
  scheduler_configuration = {
    start_rds = {
      lambda              = var.lambda_functions["start_rds"]
      schedule_expression = "cron(0 16 ? * 5 *)" # Every Thursday at 4pm
    }
    stop_rds = {
      lambda              = var.lambda_functions["stop_rds"]
      schedule_expression = "cron(59 23 ? * 5 *)" # Every Thursday just before midnight
    }
  }
}