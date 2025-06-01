terraform {
  backend "http" {}
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    gitlab = {
      source  = "gitlabhq/gitlab"
      version = "~> 17.11.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0-beta1"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.1.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "1.5.1"
    }
  }
}

output "maps_api_key" {
  value = var.maps_api_key
}

provider "gitlab" {
  token = var.gitlab_token
}

data "gitlab_project" "foreclosedhub" {
  path_with_namespace = "shanemaglangit/foreclosedhub"
}

resource "tls_private_key" "ci_ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "gitlab_project_variable" "ssh_private_key" {
  project   = data.gitlab_project.foreclosedhub.path_with_namespace
  key       = "SSH_PRIVATE_KEY"
  value     = tls_private_key.ci_ssh.private_key_pem
  protected = true
}

resource "gitlab_project_variable" "ssh_public_key" {
  project   = data.gitlab_project.foreclosedhub.path_with_namespace
  key       = "SSH_PUBLIC_KEY"
  value     = tls_private_key.ci_ssh.public_key_openssh
  protected = true
}

resource "gitlab_project_variable" "aws_access_key" {
  project   = data.gitlab_project.foreclosedhub.path_with_namespace
  key       = "AWS_ACCESS_KEY_ID"
  value     = var.aws_access_key
  protected = true
}

resource "gitlab_project_variable" "aws_secret_access_key" {
  project   = data.gitlab_project.foreclosedhub.path_with_namespace
  key       = "AWS_SECRET_ACCESS_KEY"
  value     = var.aws_secret_access_key
  protected = true
}

resource "gitlab_project_variable" "aws_region" {
  project   = data.gitlab_project.foreclosedhub.path_with_namespace
  key       = "AWS_DEFAULT_REGION"
  value     = var.aws_region
  protected = false
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key
}

resource "aws_key_pair" "ci_ssh" {
  key_name   = "ci-deploy-key"
  public_key = tls_private_key.ci_ssh.public_key_openssh
}

resource "aws_vpc" "app" {
  cidr_block                       = "10.0.0.0/16"
  assign_generated_ipv6_cidr_block = true
}

resource "aws_internet_gateway" "app" {
  vpc_id = aws_vpc.app.id
}

resource "aws_subnet" "public_1a" {
  vpc_id                  = aws_vpc.app.id
  cidr_block              = "10.0.1.0/24"
  ipv6_cidr_block         = cidrsubnet(aws_vpc.app.ipv6_cidr_block, 8, 0)
  map_public_ip_on_launch = true
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.app.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.app.id
  }
}

resource "aws_route_table_association" "public_1a" {
  subnet_id      = aws_subnet.public_1a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "app_allow_inbound" {
  name        = "app-allow-inbound"
  description = "Allow inbound traffic for gRPC and SSH (IPv4 and IPv6)"
  vpc_id      = aws_vpc.app.id

  lifecycle {
    create_before_destroy = true
  }

  ingress {
    description = "gRPC IPv4"
    from_port   = 50051
    to_port     = 50051
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH IPv4"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description      = "gRPC IPv6"
    from_port        = 50051
    to_port          = 50051
    protocol         = "tcp"
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "SSH IPv6"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_instance" "server" {
  ami                         = "ami-01938df366ac2d954"
  instance_type               = "t2.micro"
  key_name                    = aws_key_pair.ci_ssh.key_name
  subnet_id                   = aws_subnet.public_1a.id
  vpc_security_group_ids      = [aws_security_group.app_allow_inbound.id]
  associate_public_ip_address = true

  ipv6_address_count = 1
}

output "server_id" {
  value = aws_instance.server.id
}

output "server_public_ip" {
  value = aws_instance.server.public_ip
}

provider "vercel" {
  api_token = var.vercel_token
  team      = var.vercel_team_id
}

resource "vercel_project" "web" {
  name      = "foreclosedhub"
  framework = "nextjs"

  git_repository = {
    type = "gitlab"
    repo = data.gitlab_project.foreclosedhub.path_with_namespace
  }
}

resource "vercel_project_environment_variables" "web" {
  project_id = vercel_project.web.id
  variables = [
    {
      key    = "GRPC_ADDRESS"
      value  = "${aws_instance.server.public_ip}:50051"
      target = ["production"]
    },
    {
      key    = "NEXT_PUBLIC_MAPS_API_KEY"
      value  = var.maps_api_key
      target = ["production"]
    }
  ]
}

resource "vercel_project_domain" "web" {
  domain     = "foreclosedhub.com"
  project_id = vercel_project.web.id
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_r2_bucket" "storage" {
  account_id    = var.cloudflare_account_id
  name          = "foreclosedhub"
  location      = "apac"
  jurisdiction  = "default"
  storage_class = "Standard"
}

resource "cloudflare_r2_custom_domain" "storage" {
  account_id  = var.cloudflare_account_id
  zone_id     = var.cloudflare_zone_id
  bucket_name = cloudflare_r2_bucket.storage.name
  domain      = "storage.foreclosedhub.com"
  domain_name = "storage.foreclosedhub.com"
  enabled     = true
}

output "cloudflare_account_id" {
  value = var.cloudflare_account_id
}

output "cloudflare_bucket" {
  value = cloudflare_r2_bucket.storage.name
}

provider "supabase" {
  access_token = var.supabase_access_token
}

resource "supabase_project" "foreclosedhub" {
  organization_id   = var.supabase_organization_id
  name              = "foreclosedhub"
  database_password = var.supabase_db_password
  region            = var.aws_region
}


output "database_url" {
  value = "postgresql://postgres:${var.supabase_db_password}@db.${supabase_project.foreclosedhub.id}.supabase.co:5432/postgres"
}