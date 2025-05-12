variable gitlab_token {
  description = "Gitlab Access Token"
  type        = string
}

variable vercel_token {
  description = "Vercel Access Token"
  type        = string
}

variable vercel_team_id {
  description = "Vercel Team ID"
  type        = string
}

variable aws_access_key {
  description = "AWS Access Key"
  type        = string
}

variable aws_secret_access_key {
  description = "AWS Secret Access Key"
  type        = string
}

variable aws_region {
  description = "AWS Region"
  default     = "ap-southeast-1"
  type        = string
}