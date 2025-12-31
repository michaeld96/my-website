variable "region" {
  type    = string
  default = "us-east-2"
}

variable "email_domain" {
  type        = string
  default     = "michaeldick.io"
  description = "Domain of the email."
}