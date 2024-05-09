output "arn" {
  value = aws_s3_bucket.chat_lambdas_bucket.arn
}

output "bucket_name" {
  value = aws_s3_bucket.chat_lambdas_bucket.id
}
