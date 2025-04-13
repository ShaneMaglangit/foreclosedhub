terraform {
  backend "http" {
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.28.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

output "gcp_project_id" {
  value = var.gcp_project_id
}

output "gcp_zone" {
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

  allow_stopping_for_update = true

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

  service_account {
    email  = var.gcp_sa_email
    scopes = ["cloud-platform"]
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
