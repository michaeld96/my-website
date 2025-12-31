variable "region" {
  type    = string
  default = "us-east-2"
}

variable "bucket_name" {
  type = string
  default = "michaeldickio-blog-imgs-bucket"
  description = "Bucket to store images."
}

# variable "uploader_name" {
#   type = string
#   default = "admin_uploader"
#   description = "Name of IAM account."
# }