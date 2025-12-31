variable "aws_region" {
  type    = string
  default = "us-east-2"
}

variable "iam_user_name" {
  type        = string
  default     = "website-api"
  description = "IAM user name."
}

variable "iam_user_policy_name" {
  type        = string
  default     = "website-api-permission"
  description = "Name of the policy tied to the IAM user."
}