terraform {
  required_version = ">= 1.6.0"
  backend "s3" {} # real values come from backend.hcl
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

locals {
  tags = {
    Project = var.project_name
    Managed = "terraform"
  }
}

provider "aws" {
  region = var.region
}

# Upload local public key to Lightsail to SSH in.
resource "aws_lightsail_key_pair" "this" {
  name       = var.key_pair_name
  public_key = file(var.ssh_public_key_path)
  tags       = local.tags
}

# Lightsail instance.
resource "aws_lightsail_instance" "this" {
  name              = var.instance_name
  availability_zone = var.availability_zone
  blueprint_id      = var.blueprint_id
  bundle_id         = var.bundle_id
  key_pair_name     = aws_lightsail_key_pair.this.name
  tags              = local.tags
}

# Creating static IP.
resource "aws_lightsail_static_ip" "this" {
  name = "${var.project_name}-static-ip"
}

# Attaching static IP to Lightsail instance.
resource "aws_lightsail_static_ip_attachment" "this" {
  static_ip_name = aws_lightsail_static_ip.this.id
  instance_name  = aws_lightsail_instance.this.id
}

# Open firewall ports
resource "aws_lightsail_instance_public_ports" "this" {
  instance_name = aws_lightsail_instance.this.name

  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
  }

  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
  }

  port_info {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
  }
}