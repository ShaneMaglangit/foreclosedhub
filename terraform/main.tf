terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.28.0"
    }
    neon = {
      source  = "kislerdm/neon"
      version = "0.9.0"
    }
  }
}

provider "neon" {
  api_key = var.neon_api_key
}

resource "neon_project" "homagochi" {
  id        = var.neon_project_name
  name      = var.neon_project_name
  region_id = var.neon_region

  branch {
    name = var.environment
  }
}

output "neon_connection_uri" {
  value     = neon_project.homagochi.connection_uri_pooler
  sensitive = true
}

resource "neon_role" "homagochi" {
  project_id = neon_project.homagochi.id
  branch_id  = neon_project.homagochi.default_branch_id
  name       = "homagochi"
}

resource "neon_database" "homagochi" {
  project_id = neon_project.homagochi.id
  branch_id  = neon_project.homagochi.default_branch_id
  name       = "homagochi"
  owner_name = neon_role.homagochi.name
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

output gpc_project_id {
  value = var.gcp_project_id
}

output gcp_zone {
  value = var.gcp_zone
}

resource "google_storage_bucket" "bucket" {
  name     = "${var.environment}-homagochi"
  location = var.gcp_region
}

output "gcp_bucket_name" {
  value = google_storage_bucket.bucket.name
}

resource "google_compute_instance" "server" {
  name         = "server"
  machine_type = "e2-micro"
  zone         = var.gcp_zone

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 30
      type  = "pd-standard"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata = {
    startup-script = <<-EOF
      #!/bin/bash
      set -e

      # Download Go
      cd ~
      curl -OL https://go.dev/dl/go1.24.2.linux-amd64.tar.gz

      # Remove any previous Go installation
      rm -rf /usr/local/go

      # Install Go
      sudo tar -C /usr/local -xzf go1.24.2.linux-amd64.tar.gz

      # Set up Go environment
      echo "export PATH=\$PATH:/usr/local/go/bin" >> ~/.profile
      echo "export GOPATH=\$HOME/go" >> ~/.profile
      echo "export PATH=\$PATH:\$GOPATH/bin" >> ~/.profile

      # Apply environment variables
      source ~/.profile
    EOF
  }
}
