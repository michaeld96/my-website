output "ses_verification_token" {
  value = aws_ses_domain_identity.this.verification_token
}

output "ses_dkim_tokens" {
  value = aws_ses_domain_dkim.this.dkim_tokens
}