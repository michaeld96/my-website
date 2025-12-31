terraform {
  required_version = ">= 1.6.0"
  backend "s3" {}
  required_providers {
    aws = {
        source = "hashicorp/aws"
        version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_ses_domain_identity" "this" {
    domain = var.email_domain
}

resource "aws_ses_domain_dkim" "this" {
    domain = aws_ses_domain_identity.this.domain
}

# resource "aws_iam_user" "ses_sender" {
#   name = "notes-api-ses-sender"
# }

# data "aws_iam_policy_document" "ses_send" {
#   statement {
#     effect = "Allow"
#     actions = [ 
#         "ses:SendEmail",
#         "ses:SendRawEmail"
#      ]
#     resources = [ "*" ]
#   }
# }

# resource "aws_iam_user_policy" "ses_sender_policy" {
#   name = "ses-send"
#   user = aws_iam_user.ses_sender.name
#   policy = data.aws_iam_policy_document.ses_send.json
# }

# resource "aws_iam_access_key" "ses_sender" {
#   user = aws_iam_user.ses_sender.name
# }