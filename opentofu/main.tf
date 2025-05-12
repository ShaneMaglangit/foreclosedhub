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
  }
}

provider "gitlab" {
  token = var.gitlab_token
}

data "gitlab_project" "project" {
  path_with_namespace = "shanemaglangit/foreclosedhub"
}

provider "vercel" {
  api_token = var.vercel_token
  team      = var.vercel_team_id
}

resource "vercel_project" "foreclosedhub" {
  name = "foreclosedhub"
  framework = "nextjs"

  git_repository = {
    type = "gitlab"
    repo = data.gitlab_project.project.path_with_namespace
  }
}