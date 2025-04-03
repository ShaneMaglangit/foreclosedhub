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