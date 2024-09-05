data "aws_iam_policy_document" "s3_chat_lambdas_put_acl" {
  statement {
    sid = "S3ChatLambdasPutACL"
    actions = [
      "s3:PutObject",
      "s3:ListBucket",
      "s3:DeleteObject",
      "s3:PutObjectAcl"
    ]
    effect = "Allow"
    resources = [
      var.s3_chat_lambdas_arn,
      format("%s/*", var.s3_chat_lambdas_arn)
    ]
  }
}


data "aws_iam_policy_document" "s3_avatar_public_read" {
  statement {
    sid = "S3AvatarRead"
    actions = [
      "s3:GetObject",
    ]
    effect = "Allow"
    resources = [
      var.s3_avatar_arn,
      format("%s/*", var.s3_avatar_arn)
    ]
  }
}