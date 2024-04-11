resource "aws_iam_role" "web_identity_github_role" {
  name               = format("web_identity_github_role_%s", var.random_name)
  assume_role_policy = data.web_identity_github_policy_document.json
}

resource "aws_iam_policy" "s3_chat_lambdas_put_acl_policy" {
  name   = format("chat_lambdas_put_acl_policy_%s", var.random_name)
  policy = data.aws_iam_policy_document.s3_chat_lambdas_put_acl.json
}

resource "aws_iam_policy_attachment" "s3_chat_lambdas_put_acl_policy_attachment" {
  name       = aws_iam_role.web_identity_github_role.name
  policy_arn = aws_iam_policy.s3_chat_lambdas_put_acl_policy.arn
}
