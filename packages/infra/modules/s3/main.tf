resource "aws_s3_bucket" "chat_lambdas_bucket" {
  bucket = format("chat-lambdas-%s", var.random_name)
}

resource "aws_s3_bucket_public_access_block" "chat_lambdas_bucket_public_access" {
  bucket = aws_s3_bucket.chat_lambdas_bucket.id

  block_public_acls       = false
  block_public_policy     = true
  ignore_public_acls      = false
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "chat_s3_ownership" {
  bucket = aws_s3_bucket.chat_lambdas_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "chat_s3_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.chat_s3_ownership,
    aws_s3_bucket_public_access_block.chat_lambdas_bucket_public_access,
  ]

  bucket = aws_s3_bucket.chat_lambdas_bucket.id
  acl    = "public-read-write"
}