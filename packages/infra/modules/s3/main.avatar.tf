resource "aws_s3_bucket" "chat_avatars_bucket" {
  bucket = format("chat-avatars-%s", var.random_name)
}

resource "aws_s3_bucket_public_access_block" "chat_avatars_bucket_public_access" {
  bucket = aws_s3_bucket.chat_avatars_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "chat_s3_avatars_ownership" {
  bucket = aws_s3_bucket.chat_avatars_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "chat_s3_avatars_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.chat_s3_lambdas_ownership,
    aws_s3_bucket_public_access_block.chat_lambdas_bucket_public_access,
  ]

  bucket = aws_s3_bucket.chat_lambdas_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_cors_configuration" "avatar_cors_policy" {
  bucket = aws_s3_bucket.chat_avatars_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
  }
}
