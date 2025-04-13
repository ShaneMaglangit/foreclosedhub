#!/bin/bash

# Variables
INSTANCE_NAME="server"
USER="ubuntu"
LOCAL_BINARY_PATH="../backend/app"
REMOTE_BINARY_PATH="/home/$USER/app"
SERVICE_NAME="app"

echo "Authenticating SSH"
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"

echo "Initializing SSH"
gcloud compute ssh "$USER@$INSTANCE_NAME" --zone="$GCP_ZONE" --command "echo hi"

# Upload Go binary to GCE instance
echo "Uploading binary to GCE..."
gcloud compute scp "$LOCAL_BINARY_PATH" "$USER@$INSTANCE_NAME:~/app" --zone="$GCP_ZONE" --quiet

# SSH into the instance and setup systemd service
echo "Setting up systemd service..."
gcloud compute ssh "$USER@$INSTANCE_NAME" --zone="$GCP_ZONE" --command "
  chmod +x $REMOTE_BINARY_PATH

  # Create systemd service file
  echo '[Unit]
Description=App
After=network.target

[Service]
ExecStart=$REMOTE_BINARY_PATH
Restart=always
User=$USER
WorkingDirectory=/home/$USER
Environment=ENV=production
Environment=NEON_DATABASE_URL=${NEON_DATABASE_URL}
Environment=GCP_PROJECT_ID=${GCP_PROJECT_ID}
Environment=GCP_BUCKET_NAME=${GCP_BUCKET_NAME}

[Install]
WantedBy=multi-user.target' | sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null

  # Reload systemd, enable and start the service
  sudo systemctl daemon-reexec
  sudo systemctl daemon-reload
  sudo systemctl enable $SERVICE_NAME
  sudo systemctl restart $SERVICE_NAME

  # Show status
  sudo systemctl status $SERVICE_NAME --no-pager
"
