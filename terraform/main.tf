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

resource "google_compute_address" "server_ip" {
  name = "server-external-address"
  region = var.gcp_region
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
    access_config {
      nat_ip = google_compute_address.server_ip.address
    }
  }

  service_account {
    email  = var.gcp_sa_email
    scopes = ["cloud-platform"]
  }

  tags = ["grpc-server"]
}

resource "google_compute_firewall" "allow_grpc" {
  name    = "allow-grpc"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["50051"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["grpc-server"]
}

output "server_ip" {
  value = google_compute_address.server_ip.address
}