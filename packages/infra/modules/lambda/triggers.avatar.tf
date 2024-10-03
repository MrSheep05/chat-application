resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = var.s3_avatar_bucket_name

  lambda_function {
    lambda_function_arn = aws_lambda_function.lambda_functions["on_avatar_upload"].arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "users/"
  }
}
