output "bucket_name" {
  value       = aws_s3_bucket.this.id
  description = "The name of the bucket."
}

output "bucket_arn" {
  value       = aws_s3_bucket.this.arn
  description = "Application resource number for the bucket."
}

output "bucket_regional_domain_name" {
  value       = aws_s3_bucket.this.bucket_regional_domain_name
  description = "The regional domain name of the bucket."
}

output "bucket_region" {
  value       = aws_s3_bucket.this.region
  description = "Region of the bucket."
}