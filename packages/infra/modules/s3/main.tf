resource "aws_s3_bucket" "chat_lambdas_bucket" {
  bucket = format("chat-lambdas-%s", var.random_name)
}

resource "aws_s3_bucket_public_access_block" "chat_lambdas_bucket_public_access" {
  bucket = aws_s3_bucket.chat_lambdas_bucket.id

  block_public_acls       = false
}