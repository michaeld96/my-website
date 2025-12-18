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

resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id
  block_public_acls = false
  block_public_policy = false
  ignore_public_acls = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.this.id
  policy = data.aws_iam_policy_document.allow_public_reads.json
  depends_on = [ aws_s3_bucket_public_access_block.this ]
}

data "aws_iam_policy_document" "allow_public_reads" {
  statement {
    sid = "PublicReadGetObject"
    effect = "Allow"
    principals {
      type = "*"
      identifiers = [ "*" ]
    }
    actions = [ 
        "s3:GetObject"
    ]
    resources = [
        "${aws_s3_bucket.this.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = [ "*" ] // TODO: switch to https://michaeldick.io, but want to keep this "*" for local dev for the moment.
    expose_headers = ["ETag"]
    max_age_seconds = 3000
  }
}