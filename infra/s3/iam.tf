resource "aws_iam_user" "img_uploader" {
  name = var.uploader_name
}

resource "aws_iam_access_key" "img_uploader" {
  user = aws_iam_user.img_uploader.name
}

resource "aws_iam_user_policy" "name" {
  name = "allow-s3-upload"
  user = aws_iam_user.img_uploader.name
  policy = data.aws_iam_policy_document.uploader_policy.json
}

data "aws_iam_policy_document" "uploader_policy" {
  statement {
    effect = "Allow"
    actions = [
        "s3:PutObject",
        "s3:PutObjectAcl"
    ]
    resources = [ 
        "${aws_s3_bucket.this.arn}/*"
     ]
  }
}