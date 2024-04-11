terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "mrsheep"
    workspaces {
      name = "chat-application"
    }
  }
}