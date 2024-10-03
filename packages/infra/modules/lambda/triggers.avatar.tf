resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = var.s3_avatar_bucket_name

  lambda_function {
    lambda_function_arn = aws_lambda_function.lambda_functions["on_avatar_upload"].arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "users/"
  }

  depends_on = [
    aws_lambda_permission.allow_bucket
  ]
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3AvatarBucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_functions["on_avatar_upload"].arn
  principal     = "s3.amazonaws.com"
  source_arn    = var.s3_avatar_bucket_arn
}
