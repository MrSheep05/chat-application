data "aws_iam_policy_document" "web_identity_github_policy_document" {
  statement {
    sid    = "WebIdentityGithub"
    effect = "Allow"
    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::your-account-number:oidc-provider/token.actions.githubusercontent.com"]
    }
    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:MrSheep05/chat-application:*"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

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
