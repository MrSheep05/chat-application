variable "random_name" {
  description = "Random string to add to names for this environment."
  type        = string
}

variable "api_gateway_api_id" {
  type = string
}

variable "lambda_functions" {
  type = map(object({
    iam_role_name : string
    permissions : map(any)
  }))
}

variable "api_gateway_role_name" {
  type = string
}

variable "kms_jwt_arn" {
  type = string
}

variable "kms_refresh_jwt_arn" {
  type = string
}

variable "s3_chat_lambdas_arn" {
  type = string
}

variable "s3_avatar_arn" {
  type = string
}

variable "s3_avatar_id" {
  type = string
}