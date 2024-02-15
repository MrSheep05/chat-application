provider "aws" {
  region  = "eu-west-2"
  profile = "chat"

  default_tags {
    tags = {
      Project   = "terraform-aws-chat"
      ProjectId = module.random.random_name
    }
  }
}
