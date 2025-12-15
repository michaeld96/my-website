variable "region" {
  type    = string
  default = "us-east-2"
}

variable "state_bucket_name" {
  type    = string
  default = "michaeldickiostatebucket"
}

variable "lock_table_name" {
  type    = string
  default = "michaeldickio_lock_table"
}