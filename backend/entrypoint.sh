#!/bin/bash

set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db -U postgres; do
  sleep 1
done

echo "PostgreSQL is ready!"

echo "Creating migrations..."
python manage.py makemigrations --noinput || true

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

echo "Starting server..."
exec "$@"

