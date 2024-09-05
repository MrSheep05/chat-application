resource "aws_iam_policy" "s3_chat_lambdas_put_acl_policy" {
  name   = format("chat_lambdas_put_acl_policy_%s", var.random_name)
  policy = data.aws_iam_policy_document.s3_chat_lambdas_put_acl.json
}

resource "aws_iam_role_policy_attachment" "s3_chat_lambdas_put_acl_policy_attachment" {
  role       = aws_iam_role.web_identity_github_role.name
  policy_arn = aws_iam_policy.s3_chat_lambdas_put_acl_policy.arn
}

resource "aws_s3_bucket_policy" "allow_access_from_another_account" {
  bucket = var.s3_avatar_id
  policy = data.aws_iam_policy_document.s3_avatar_public_read.json
}
