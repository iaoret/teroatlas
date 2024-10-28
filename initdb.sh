#!/bin/bash

# Check if the backup file exists, and if not, download it
if [ ! -f /mnt/latest.backup ]; then
  echo "Backup file not found. Downloading from provided URL..."
  curl -L -o /mnt/latest.backup "https://gr6tkdct0hgi.objectstorage.sa-saopaulo-1.oci.customer-oci.com/n/gr6tkdct0hgi/b/teroatlas/o/latest.backup"
  if [ $? -eq 0 ]; then
    echo "Backup downloaded successfully."
  else
    echo "Failed to download backup. Exiting."
    exit 1
  fi
fi

# Wait until PostgreSQL is ready to accept connections
until pg_isready -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL to start..."
  sleep 5
done

# Create the teroatlas database
echo "Creating database teroatlas..."
createdb -U postgres teroatlas
echo "Database teroatlas created!"

# Restore the backup
echo "Restoring backup on teroatlas..."
pg_restore -U postgres -d teroatlas -v /mnt/latest.backup
echo "Backup successfully restored on teroatlas!"

# Send notification to PostgREST
psql -U postgres -d teroatlas -c "NOTIFY pgrst;"
