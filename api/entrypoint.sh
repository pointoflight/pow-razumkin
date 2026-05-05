#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting API server..."
exec dumb-init node dist/app.js
