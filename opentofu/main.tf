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
  }
}

provider "gitlab" {
  token = var.gitlab_token
}

data "gitlab_project" "repository" {
  path_with_namespace = "shanemaglangit/foreclosedhub"
}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "gitlab_project_variable" "ssh_private_key" {
  project   = data.gitlab_project.repository.path_with_namespace
  key       = "SSH_PRIVATE_KEY"
  value     = tls_private_key.ssh.private_key_pem
  protected = true
}

resource "gitlab_project_variable" "ssh_public_key" {
  project   = data.gitlab_project.repository.path_with_namespace
  key       = "SSH_PUBLIC_KEY"
  value     = tls_private_key.ssh.public_key_openssh
  protected = true
}

resource "gitlab_project_variable" "aws_access_key" {
  project   = data.gitlab_project.repository.path_with_namespace
  key       = "AWS_ACCESS_KEY_ID"
  value     = var.aws_access_key
  protected = true
}

resource "gitlab_project_variable" "aws_secret_access_key" {
  project   = data.gitlab_project.repository.path_with_namespace
  key       = "AWS_SECRET_ACCESS_KEY"
  value     = var.aws_secret_access_key
  protected = true
}

resource "gitlab_project_variable" "aws_default_region" {
  project   = data.gitlab_project.repository.path_with_namespace
  key       = "AWS_DEFAULT_REGION"
  value     = var.aws_region
  protected = false
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key
}

resource "aws_key_pair" "server" {
  key_name   = "ci-deploy-key"
  public_key = tls_private_key.ssh.public_key_openssh
}

resource "aws_instance" "server" {
  ami           = "ami-0e8ebb0ab254bb563"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.server.key_name
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
    repo = data.gitlab_project.repository.path_with_namespace
  }
}

resource "vercel_project_domain" "web" {
  domain     = "foreclosedhub.com"
  project_id = vercel_project.web.id
}

output "ec2_instance_id" {
  value = aws_instance.server.id
}

output "ec2_public_ip" {
  value = aws_instance.server.public_ip
}