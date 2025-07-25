variable "gitlab_token" {
  description = "Gitlab Access Token"
  type        = string
}

variable "vercel_token" {
  description = "Vercel Access Token"
  type        = string
}

variable "vercel_team_id" {
  description = "Vercel Team ID"
  type        = string
}

variable "maps_api_key" {
  description = "Google Maps API Key"
  type        = string
}

variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  default     = "ap-southeast-1"
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID"
  type        = string
}

variable "supabase_organization_id" {
  description = "Supabase Organization ID"
  type        = string
}

variable "supabase_access_token" {
  description = "Supabase Access Token"
  type        = string
}

variable "supabase_db_password" {
  description = "Supabase Database Password"
  type        = string
}