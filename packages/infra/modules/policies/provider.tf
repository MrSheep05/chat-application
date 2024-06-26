resource "aws_iam_openid_connect_provider" "github-provider" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com",
    "https://github.com/MrSheep05/chat-application"
  ]

  thumbprint_list = ["1b511abead59c6ce207077c0bf0e0043b1382612"]
}