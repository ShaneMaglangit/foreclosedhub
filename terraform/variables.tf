variable "environment" {
  description = "Environment of the app (dev, staging, prod)."
  default     = "dev"
}

variable "gcp_project_id" {
  description = "GCP Project ID."
}

variable "gcp_region" {
  description = "GCP Region."
}

variable "gcp_zone" {
  description = "GCP Zone."
}

variable "gcp_sa_email" {
  description = "GCP Service account."
}

variable "grpc_client_ip_cidr_range" {
  description = "GCP Client IP."
}