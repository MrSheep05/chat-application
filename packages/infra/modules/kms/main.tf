resource "aws_kms_key" "jwt" {
  description              = "KMS JWTs key"
  is_enabled               = true
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "RSA_4096"
}

resource "aws_kms_alias" "jwt" {
  name          = "alias/jwt"
  target_key_id = aws_kms_key.jwt.key_id
}

resource "aws_kms_key" "refresh_jwt" {
  description              = "KMS refresh key"
  is_enabled               = true
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "RSA_4096"
}

resource "aws_kms_alias" "refresh_jwt" {
  name          = "alias/refresh_jwt"
  target_key_id = aws_kms_key.refresh_jwt.key_id
}
