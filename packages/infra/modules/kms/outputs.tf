output "kms_jwt_arn" {
  value = aws_kms_key.jwt.arn
}

output "kms_jwt_alias_name" {
  value = aws_kms_alias.jwt.name
}

output "kms_refresh_jwt_arn" {
  value = aws_kms_key.refresh_jwt.arn
}

output "kms_refresh_jwt_alias_name" {
  value = aws_kms_alias.refresh_jwt.name
}
