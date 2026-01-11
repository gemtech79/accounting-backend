#!/bin/bash
# Write secret key to temp file
echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" > /tmp/gcp.json
export GOOGLE_APPLICATION_CREDENTIALS=/tmp/gcp.json

# Start Cloud SQL Proxy in background
cloud-sql-proxy gemtech-480822:us-central1:balancekeeper --port=5432 &

echo "Cloud SQL Proxy started on localhost:5432"
