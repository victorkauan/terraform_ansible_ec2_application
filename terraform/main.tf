# Busca a AMI mais recente do Amazon Linux 2 em us-east-1
data "aws_ami" "amazon_linux2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_security_group" "app_sg" {
  name_prefix = "app-sg-"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Permite HTTP de qualquer lugar
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["177.37.13.10/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # Permite todo o tráfego de saída
  }

  tags = {
    Name = "EC2 DevOps Pos Graduacao"
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux2.id
  instance_type = var.instance_type
  key_name      = var.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id] # Associa o SG

  associate_public_ip_address = true

  root_block_device {
    volume_size = 10
    volume_type = "gp2"
  }

  tags = {
    Name = "EC2 DevOps Pos Graduacao"
    Team = "4tetofantastico"
  }
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app.public_ip
}
