variable "region" {
  type    = string
  default = "us-east-2"
}

variable "project_name" {
  type        = string
  default     = "personal-website"
  description = "Name prefix of Lightsail resources."
}

variable "ssh_public_key_path" {
  type        = string
  description = "Path to public SSH key (used for Lightsail key pair)."
}

variable "key_pair_name" {
  type        = string
  default     = "personal-website-key"
  description = "Name of the Lightsail key pair."
}

variable "instance_name" {
  type        = string
  default     = "personal-website"
  description = "Lightsail instance name."
}

variable "blueprint_id" {
  type        = string
  default     = "ubuntu_22_04"
  description = "Lightsail OS image."
}

variable "bundle_id" {
  type        = string
  default     = "nano_3_0"
  description = "Lightsail instance plan/bundle id"
}

variable "availability_zone" {
  type = string
  default = "us-east-2a"
  description = "AZ for lightsail instance."
}