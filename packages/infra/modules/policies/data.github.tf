data "aws_iam_policy_document" "web_identity_github_policy_document" {
  statement {
    sid    = "WebIdentityGithub"
    effect = "Allow"
    principals {
      type = "Federated"
      identifiers = [
        format("arn:aws:iam::%s:oidc-provider/token.actions.githubusercontent.com", data.aws_caller_identity.current.account_id)
      ]
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
