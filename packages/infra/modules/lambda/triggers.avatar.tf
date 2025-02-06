resource "aws_lambda_permission" "allow_bucket_on_proccessed" {
  statement_id  = "AllowExecutionFromS3AvatarBucketOnProcessed"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_functions["on_avatar_proccessed"].arn
  principal     = "s3.amazonaws.com"
  source_arn    = var.s3_avatar_bucket_arn
}

resource "aws_lambda_permission" "allow_bucket_on_upload" {
  statement_id  = "AllowExecutionFromS3AvatarBucketOnUpload"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_functions["on_avatar_uploaded"].arn
  principal     = "s3.amazonaws.com"
  source_arn    = var.s3_avatar_bucket_arn
}

resource "aws_s3_bucket_notification" "avatar_bucket_notification" {
  bucket = var.s3_avatar_bucket_name

  lambda_function {
    lambda_function_arn = aws_lambda_function.lambda_functions["on_avatar_uploaded"].arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
  }

  lambda_function {
    lambda_function_arn = aws_lambda_function.lambda_functions["on_avatar_proccessed"].arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "users/"
  }

  depends_on = [
    aws_lambda_permission.allow_bucket_on_upload,
    aws_lambda_permission.allow_bucket_on_proccessed
  ]
}


