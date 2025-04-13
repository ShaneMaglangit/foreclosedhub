variable "environment" {
  description = "Environment of the app (dev, staging, prod)."
  default = "dev"
}

variable "gcp_project_id" {
  description = "GCP Project ID."
}

variable "gcp_region" {
  description = "GCP Region."
}

variable "gcp_zone" {
  description = "Zone for GCP."
}

variable "gcp_sa_email" {
  description = "Email for gcp service account."
}

variable "neon_api_key" {
  description = "API key for Neon."
}

variable "neon_project_name" {
  description = "Project name for Neon."
}

variable "neon_region" {
  description = "Region ID for Neon."
}