#!/bin/bash
set -e

echo "=== Razumkin Platform Setup ==="

# Create uploads directory
mkdir -p uploads

# Install nginx config
cp nginx/razumkin.conf /etc/nginx/sites-available/razumkin
ln -sf /etc/nginx/sites-available/razumkin /etc/nginx/sites-enabled/razumkin

# Test nginx config
nginx -t

# Open firewall port
ufw allow 8090/tcp

# Build and start containers
docker-compose up -d --build

echo ""
echo "Waiting for containers to be healthy..."
sleep 15

# Run database migrations
docker-compose exec api npx prisma migrate deploy

# Seed initial data
docker-compose exec api npx prisma db seed

# Reload nginx
nginx -s reload

echo ""
echo "=== Setup Complete ==="
echo "Platform available at: http://89.167.58.170:8090"
echo ""
echo "Demo accounts:"
echo "  Admin:    admin@razumkin.ru / Admin1234!"
echo "  Business: akademiya@example.ru / Pass1234!"
echo "  Parent:   parent@example.ru / Pass1234!"
