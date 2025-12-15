output "static_ip" {
  value       = aws_lightsail_static_ip.this.ip_address
  description = "Public static UP for Lightsail instance." # Will point DNS record here.
}

output "instance_name" {
  value       = aws_lightsail_instance.this.name
  description = "Lightsail instance name."
}

output "ssh_command" {
  value       = "ssh ubuntu@${aws_lightsail_static_ip.this.ip_address}"
  description = "SSH command (Ubuntu blueprint uses ubuntu user)"
}