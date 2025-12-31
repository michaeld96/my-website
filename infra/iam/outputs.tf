output "iam_access_key" {
    value = aws_iam_access_key.website_api.id
    sensitive = true
}

output "iam_secret_key" {
    value = aws_iam_access_key.website_api.secret
    sensitive = true
}

