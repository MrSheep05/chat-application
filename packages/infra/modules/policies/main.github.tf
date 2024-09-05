resource "aws_iam_role" "web_identity_github_role" {
  name               = format("web_identity_github_role_%s", var.random_name)
  assume_role_policy = data.aws_iam_policy_document.web_identity_github_policy_document.json
}
