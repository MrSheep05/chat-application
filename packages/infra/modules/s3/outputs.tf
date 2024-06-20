output "lambda_bucket_arn" {
  value = aws_s3_bucket.chat_lambdas_bucket.arn
}

output "lambda_bucket_name" {
  value = aws_s3_bucket.chat_lambdas_bucket.id
}

output "avatar_bucket_arn" {
  value = aws_s3_bucket.chat_avatars_bucket.arn
}

output "avatar_bucket_name" {
  value = aws_s3_bucket.chat_avatars_bucket.id
}