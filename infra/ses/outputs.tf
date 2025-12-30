output "ses_verification_token" {
    value = aws_ses_domain_identity.this.verification_token
}

output "ses_dkim_tokens" {
  value = aws_ses_domain_dkim.this.dkim_tokens
}

output "ses_access_key_id" {
    value = aws_iam_access_key.ses_sender.id
}

output "ses_secret_access_key" {
    value = aws_iam_access_key.ses_sender.secret
    sensitive = true
}