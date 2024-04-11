resource "aws_s3_bucket" "chat_lambdas_bucket" {
  bucket = format("chat-lambdas-%s", var.random_name)
}
