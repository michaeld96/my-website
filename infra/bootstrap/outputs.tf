output "state_bucket_name" {
  value       = var.state_bucket_name
  description = "S3 bucket name for Terraform state."
}

output "lock_table_name" {
  value       = var.lock_table_name
  description = "DynamoDB table name for Terraform state locking."
}

output "aws_region" {
  value       = var.region
  description = "Region where the state resources are located."
}