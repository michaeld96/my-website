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

// Gathering other resources via remote backend.
data "terraform_remote_state" "s3" {
    backend = "s3"
    config = {
        bucket = "michaeldickiostatebucket"
        key = "personal-website/s3/terraform.tfstate"
        region = "us-east-2"
    }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_iam_user" "website_api" {
  name = var.iam_user_name
}

resource "aws_iam_access_key" "website_api" {
  user = aws_iam_user.website_api.name
}

resource "aws_iam_user_policy" "website_api" {
  name = var.iam_user_policy_name
  user = aws_iam_user.website_api.name
  policy = data.aws_iam_policy_document.policy.json
}

data "aws_iam_policy_document" "policy" {
  statement {
    effect = "Allow"
    actions = [ 
        "s3:PutObject",
        "s3:PubObjectAcl",
        "ses:SendEmail",
        "ses:SendRawEmail"
     ]
     resources = [
        "${data.terraform_remote_state.s3.outputs.bucket_arn}/*",
        "*"
     ]
  }
}
