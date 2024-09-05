locals {
  lambda_functions = {
    "connect" = {
      allow_api_gateway_execution = "false"
      route_key                   = "$connect"
      environment_variables       = {}
      permissions = {
        kms                = "none"
        manage_connections = "false"
        rds                = "connect"
        s3_avatar          = "none"
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
        s3_avatar          = "none"
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
        s3_avatar          = "none"
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
        s3_avatar          = "none"
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
        s3_avatar          = "none"
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
        s3_avatar          = "none"
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
        s3_avatar          = "none"
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
        s3_avatar          = "none"
      }
    }
    "get_messages" = {
      allow_api_gateway_execution = "false"
      route_key                   = "getMessages"
      environment_variables       = {}
      permissions = {
        kms                = "none"
        manage_connections = "true"
        rds                = "connect"
        s3_avatar          = "none"
      }
    }

    "request_avatar_upload_url" = {
      allow_api_gateway_execution = "false"
      route_key                   = "requestAvatarUploadUrl"
      environment_variables = {
        bucketName = var.s3_avatar_bucket_name
      }
      permissions = {
        kms                = "none"
        manage_connections = "true"
        rds                = "connect"
        s3_avatar          = "write"
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
        s3_avatar          = "none"
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
        s3_avatar          = "none"
      }
    }
  }
}
