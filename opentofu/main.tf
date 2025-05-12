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
  }
}

provider "gitlab" {
  token = var.gitlab_token
}

data "gitlab_project" "repository" {
  path_with_namespace = "shanemaglangit/foreclosedhub"
}

provider "vercel" {
  api_token = var.vercel_token
  team      = var.vercel_team_id
}

resource "vercel_project" "web" {
  name = "foreclosedhub"
  framework = "nextjs"

  git_repository = {
    type = "gitlab"
    repo = data.gitlab_project.repository.path_with_namespace
  }
}

resource "vercel_project_domain" "web" {
  domain = "foreclosedhub.com"
  project_id = vercel_project.web.id
}

provider "aws" {
  region = "ap-southeast-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key
}

resource "aws_instance" "server" {
  ami = "ami-0e8ebb0ab254bb563"
  instance_type = "t2.micro"
}