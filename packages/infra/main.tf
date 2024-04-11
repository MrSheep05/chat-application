module "random" {
  source = "./modules/random"
}

module "kms" {
  source = "./modules/kms"
}

module "s3" {
  source = "./modules/s3"
  
  random_name = module.random.random_name
}
module "lambda" {
  source = "./modules/lambda"

  kms_jwt_alias_name         = module.kms.kms_jwt_alias_name
  kms_refresh_jwt_alias_name = module.kms.kms_refresh_jwt_alias_name

  salt        = var.salt
  random_name = module.random.random_name
}

module "api_gateway" {
  source = "./modules/api_gateway"

  random_name      = module.random.random_name
  lambda_functions = module.lambda.lambda_functions
}
module "api_gateway_v2" {
  source = "./modules/api_gateway_v2"

  random_name      = module.random.random_name
  lambda_functions = module.lambda.lambda_functions
}

module "event_bridge" {
  source = "./modules/event_bridge"

  random_name      = module.random.random_name
  lambda_functions = module.lambda.lambda_functions
}

module "policies" {
  source = "./modules/policies"

  random_name           = module.random.random_name
  lambda_functions      = module.lambda.lambda_functions
  api_gateway_api_id    = module.api_gateway_v2.api_gateway_api_id
  api_gateway_role_name = module.api_gateway_v2.api_gateway_role_name
  kms_jwt_arn           = module.kms.kms_jwt_arn
  kms_refresh_jwt_arn   = module.kms.kms_refresh_jwt_arn
  s3_chat_lambdas_arn   = module.s3.arn
}
