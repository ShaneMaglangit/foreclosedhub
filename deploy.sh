#!/bin/bash

# Variables
INSTANCE_NAME="server"
USER="ubuntu"
LOCAL_BINARY_PATH="./app"
REMOTE_BINARY_PATH="/home/$USER/app"
SERVICE_NAME="app"
CERTS_DIR="/home/$USER/certs"

echo "Authenticating SSH"
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"

echo "Initializing SSH"
gcloud compute ssh "$USER@$INSTANCE_NAME" --project="$GCP_PROJECT_ID" --zone="$GCP_ZONE" --command "echo hi"

echo "Stopping running service..."
gcloud compute ssh "$USER@$INSTANCE_NAME" --project="$GCP_PROJECT_ID" --zone="$GCP_ZONE" --command "
  sudo systemctl stop $SERVICE_NAME || true
"

echo "Uploading binary to GCE..."
gcloud compute scp "$LOCAL_BINARY_PATH" "$USER@$INSTANCE_NAME:~/app" --project="$GCP_PROJECT_ID" --zone="$GCP_ZONE" --quiet

echo "Setting up TLS certs..."
gcloud compute ssh "$USER@$INSTANCE_NAME" --project="$GCP_PROJECT_ID" --zone="$GCP_ZONE" --command "
  mkdir -p $CERTS_DIR

  if [[ ! -f $CERTS_DIR/ca.crt || ! -f $CERTS_DIR/server.crt || ! -f $CERTS_DIR/server.key ]]; then
    echo 'Generating TLS certs...'

    openssl genrsa -out $CERTS_DIR/ca.key 4096
    openssl req -x509 -new -nodes -key $CERTS_DIR/ca.key -subj \"/CN=local-ca\" -days 365 -out $CERTS_DIR/ca.crt

    openssl genrsa -out $CERTS_DIR/server.key 4096
    openssl req -new -key $CERTS_DIR/server.key -subj \"/CN=$INSTANCE_NAME\" -out $CERTS_DIR/server.csr

    openssl x509 -req -in $CERTS_DIR/server.csr -CA $CERTS_DIR/ca.crt -CAkey $CERTS_DIR/ca.key -CAcreateserial -out $CERTS_DIR/server.crt -days 365

    rm -f $CERTS_DIR/server.csr $CERTS_DIR/ca.key $CERTS_DIR/ca.srl
  else
    echo 'TLS certs already exist. Skipping generation.'
  fi
"

echo "Setting up systemd service..."
gcloud compute ssh "$USER@$INSTANCE_NAME" --project="$GCP_PROJECT_ID" --zone="$GCP_ZONE" --command "
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
Environment=\"ENV=production\"
Environment=\"NEON_DATABASE_URL=${NEON_DATABASE_URL}\"
Environment=\"GCP_PROJECT_ID=${GCP_PROJECT_ID}\"
Environment=\"GCP_BUCKET_NAME=${GCP_BUCKET_NAME}\"
Environment=\"CERTS_DIR=$CERTS_DIR\"

[Install]
WantedBy=multi-user.target' | sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null

  sudo systemctl daemon-reexec
  sudo systemctl daemon-reload
  sudo systemctl enable $SERVICE_NAME
  sudo systemctl start $SERVICE_NAME

  sudo systemctl status $SERVICE_NAME --no-pager
"
