variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
}

variable "salt" {
  type = string
}

variable "kms_jwt_alias_name" {
  type = string
}

variable "kms_refresh_jwt_alias_name" {
  type = string
}

variable "s3_bucket_name" {
  type = string
}