locals {
  lambda_root_directory         = "../lambdas"
  lambda_build_output_directory = format("%s/dist", local.lambda_root_directory)

  lambda_functions = {
    "connect" = {
      allow_api_gateway_execution = "false"
      route_key                   = "$connect"
      environment_variables       = {}
      permissions = {
        kms                = "none"
        manage_connections = "false"
        rds                = "connect"
      }
    },
    "disconnect" = {
      allow_api_gateway_execution = "false"
      route_key                   = "$disconnect"
      environment_variables       = {}
      permissions = {
        kms                = "none"
        manage_connections = "false"
        rds                = "connect"
      }
    },
    "message" = {
      allow_api_gateway_execution = "false"
      route_key                   = "message"
      environment_variables       = {}
      permissions = {
        kms                = "none"
        manage_connections = "true"
        rds                = "connect"
      }
    },
    "remove" = {
      allow_api_gateway_execution = "false"
      route_key                   = "remove"
      environment_variables       = {}
      permissions = {
        kms                = "none"
        manage_connections = "true"
        rds                = "connect"
      }
    },
    "register" = {
      allow_api_gateway_execution = "true"
      environment_variables = {
        salt = var.salt
      }
      permissions = {
        kms                = "none"
        manage_connections = "false"
        rds                = "connect"
      }
    },
    "login" = {
      allow_api_gateway_execution = "true"
      environment_variables = {
        salt                   = var.salt
        kmsJwtAliasName        = var.kms_jwt_alias_name
        kmsRefreshJwtAliasName = var.kms_refresh_jwt_alias_name
      }
      permissions = {
        kms                = "sign"
        manage_connections = "false"
        rds                = "connect"
      }
    }
    "refresh" = {
      allow_api_gateway_execution = "true"
      environment_variables = {
        salt                   = var.salt
        kmsJwtAliasName        = var.kms_jwt_alias_name
        kmsRefreshJwtAliasName = var.kms_refresh_jwt_alias_name
      }
      permissions = {
        kms                = "sign-and-verify"
        manage_connections = "false"
        rds                = "none"
      }
    }
    "authorize" = {
      allow_api_gateway_execution = "false"
      environment_variables = {
        kmsJwtAliasName        = var.kms_jwt_alias_name
        kmsRefreshJwtAliasName = var.kms_refresh_jwt_alias_name
      }
      permissions = {
        kms                = "verify"
        manage_connections = "false"
        rds                = "none"
      }
    }
    "get_messages" = {
      allow_api_gateway_execution = "false"
      route_key                   = "get_messages"
      environment_variables       = {}
      permissions = {
        kms                = "none"
        manage_connections = "true"
        rds                = "connect"
      }
    }
    "start_rds" = {
      allow_api_gateway_execution = "true"
      environment_variables = {
        databaseInstanceIdentifier = "tprzytula"
      }
      permissions = {
        kms                = "none"
        manage_connections = "false"
        rds                = "start"
      }
    }
    "stop_rds" = {
      allow_api_gateway_execution = "true"
      environment_variables = {
        databaseInstanceIdentifier = "tprzytula"
      }
      permissions = {
        kms                = "none"
        manage_connections = "false"
        rds                = "stop"
      }
    }
  }
}
